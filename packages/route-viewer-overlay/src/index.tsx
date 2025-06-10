import { util } from "@opentripplanner/base-map";
import { Stop } from "@opentripplanner/types";
import { LngLatBounds } from "maplibre-gl";
import { Layer, LngLatLike, Source, useMap } from "react-map-gl/maplibre";
import React, { useEffect } from "react";

import polyline from "@mapbox/polyline";
import pointInPolygon from "point-in-polygon";
import { objectExistsAndPopulated } from "./util";

// Type guard to ensure Position has at least 2 coordinates as per RFC 7946
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/21590
// DefinitelyTyped will never fix this, so we need the type guard.
const isValidPosition = (
  position: GeoJSON.Position
): position is [number, number] => {
  return position.length >= 2;
};

type RouteData = {
  color?: string;
  patterns: Record<
    string,
    {
      id: string;
      name?: string;
      geometry?: { points: [number, number][] };
      stops?: Stop[];
    }
  >;
};

type Props = {
  /**
   * If pattern stops contain polygons, we can request that the routes are not drawn
   * inside of these polygons by setting this prop to true. If true, the layer will
   * check every zone of every stop in a pattern before drawing the route for that pattern
   * and only draw the route outside of the polygon.
   */
  clipToPatternStops?: boolean;
  /**
   * This method is called whenever the bounds are updated to fit a route
   */
  mapCenterCallback: () => void;
  /**
   * Some Leaflet properties that have been mapped to MapLibreGL
   * TODO: expose MapLibre properties?
   */
  path?: { color?: string; opacity?: number; weight?: number };
  /**
   * This represents data about a route as obtained from a transit index.
   * Typically a route has more data than these items, so this is only a list of
   * the properties that this component actually uses.
   */
  routeData: RouteData;
};

// helper fn to check if geometry has been populated for all patterns in route
const isGeometryComplete = (routeData: RouteData) =>
  routeData?.patterns &&
  Object.values(routeData.patterns).every(
    ptn => typeof ptn?.geometry !== "undefined"
  );

/**
 * Recursively extracts all coordinate pairs from any GeoJSON geometry type
 * @param geometry - Any GeoJSON geometry object
 * @returns Array of [lng, lat] coordinate pairs
 */
const extractCoordinatesFromGeometry = (
  geometry: GeoJSON.Geometry
): [number, number][] => {
  const coordinates: [number, number][] = [];

  switch (geometry.type) {
    case "Point":
      if (isValidPosition(geometry.coordinates)) {
        coordinates.push([geometry.coordinates[0], geometry.coordinates[1]]);
      }
      break;

    case "MultiPoint":
      geometry.coordinates.forEach(coord => {
        if (isValidPosition(coord)) {
          coordinates.push([coord[0], coord[1]]);
        }
      });
      break;

    case "LineString":
      geometry.coordinates.forEach(coord => {
        if (isValidPosition(coord)) {
          coordinates.push([coord[0], coord[1]]);
        }
      });
      break;

    case "MultiLineString":
      geometry.coordinates.forEach(lineString => {
        lineString.forEach(coord => {
          if (isValidPosition(coord)) {
            coordinates.push([coord[0], coord[1]]);
          }
        });
      });
      break;

    case "Polygon":
      geometry.coordinates.forEach(ring => {
        ring.forEach(coord => {
          if (isValidPosition(coord)) {
            coordinates.push([coord[0], coord[1]]);
          }
        });
      });
      break;

    case "MultiPolygon":
      geometry.coordinates.forEach(polygon => {
        polygon.forEach(ring => {
          ring.forEach(coord => {
            if (isValidPosition(coord)) {
              coordinates.push([coord[0], coord[1]]);
            }
          });
        });
      });
      break;

    case "GeometryCollection":
      // Recursively extract coordinates from all geometries in the collection
      geometry.geometries.forEach(subGeometry => {
        coordinates.push(...extractCoordinatesFromGeometry(subGeometry));
      });
      break;

    default:
      console.warn(`Unsupported geometry type: ${(geometry as any).type}`);
  }

  return coordinates;
};

/**
 * Extends bounds with coordinates from any GeoJSON geometry
 * @param bounds - Current bounds object (or null)
 * @param geometry - GeoJSON geometry to extract bounds from
 * @returns Extended bounds object
 */
const extendBoundsWithGeometry = (
  bounds: LngLatBounds | null,
  geometry: GeoJSON.Geometry
): LngLatBounds => {
  const coordinates = extractCoordinatesFromGeometry(geometry);

  if (coordinates.length === 0) {
    return bounds || new LngLatBounds([0, 0], [0, 0]);
  }

  let newBounds = bounds;
  coordinates.forEach(coord => {
    newBounds = newBounds
      ? newBounds.extend(coord)
      : new LngLatBounds(coord, coord);
  });

  return newBounds;
};

/**
 * helper function that removes all points from array of points that are
 * within flex zones defined in an array of stops
 * @param {*} stops   OTP stops response
 * @param {*} points  Array of coordinates to clip
 * @returns           The array of coordinates without coordinates within the stops
 */
const removePointsInFlexZone = (stops: Stop[], points: [number, number][]) => {
  // First, go through all stops to find flex zones
  const bboxes =
    stops
      // Although it is less clean, doing a single map with many if conditions
      // is much faster than adding multiple filters (as the array is iterated over fewer times)
      // Adding a separate filter would increase the time spent processing the array, which
      // needs to be kept to a minimum as this is happening inside render()
      // For more detail see https://github.com/dg92/Performance-Analysis-JS/blob/master/small_data_set_result.png
      ?.map(stop => {
        if (stop.geometries?.geoJson?.type !== "Polygon") {
          return null;
        }
        return stop.geometries.geoJson.coordinates?.[0] || null;
      })
      // Remove the null entries
      // This filter is required, as there is no way to have map not return a value
      .filter(bbox => !!bbox) || [];

  // Points we keep can't be in any of the flex zones
  return points.filter(([y, x]) =>
    bboxes.every(bbox => !pointInPolygon([x, y], bbox))
  );
};

/**
 * Reducer helper for computing the bounds of a geometry.
 */
const reduceBounds = (bnds, coord) => bnds.extend(coord);

/**
 * An overlay that will display all polylines of the patterns of a route.
 */
const RouteViewerOverlay = (props: Props): JSX.Element => {
  const { current } = useMap();
  const { routeData } = props;
  const patterns = Object.values(routeData.patterns);
  useEffect(() => {
    // if pattern geometry updated, update the map points
    let bounds: LngLatBounds | undefined;
    let timeout: NodeJS.Timeout | undefined;

    if (isGeometryComplete(routeData)) {
      const allPoints: LngLatLike[] = patterns.reduce((acc, ptn) => {
        return acc.concat(polyline.decode(ptn.geometry.points));
      }, []);

      if (allPoints.length > 0) {
        const geoJsonedPoints: [number, number][] = allPoints.map(c => {
          return [c[1], c[0]];
        });
        bounds = geoJsonedPoints.reduce(
          reduceBounds,
          new LngLatBounds(geoJsonedPoints[0], geoJsonedPoints[0])
        );
      }
    }

    patterns.forEach(ptn => {
      ptn.stops?.forEach(stop => {
        const { geoJson } = stop.geometries || {};
        if (geoJson) {
          bounds = extendBoundsWithGeometry(bounds, geoJson);
        }
      });
    });

    if (bounds && current) {
      // Try to fit the map to route bounds immediately. If other overlays are still populating contents
      // and/or the map skips/aborts fitting for any reason, try fitting bounds again after a short delay.
      const fitBounds = () => util.fitMapBounds(current, bounds);
      fitBounds();
      timeout = setTimeout(fitBounds, 250);
      if (props.mapCenterCallback) {
        props.mapCenterCallback();
      }
    }

    // Clear any timeouts when the component unmounts.
    return () => clearTimeout(timeout);
  }, [routeData, patterns, current]);

  const { clipToPatternStops, path } = props;

  // Null can't be returned here -- react-map-gl dislikes null values as children
  if (!routeData || !routeData.patterns) return <></>;

  const routeColor = routeData.color
    ? `#${routeData.color}`
    : path?.color || "#00bfff";
  const segments = patterns
    .filter(pattern => objectExistsAndPopulated(pattern?.geometry))
    .map(pattern => {
      const pts = polyline.decode(pattern.geometry.points);
      const clippedPts = clipToPatternStops
        ? removePointsInFlexZone(pattern?.stops, pts)
        : pts;

      return clippedPts.map((pt: [number, number]) => [pt[1], pt[0]]);
    });

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: segments.map(segment => ({
      type: "Feature",
      geometry: { type: "LineString", coordinates: segment },
      properties: []
    }))
  };

  return segments.length > 0 ? (
    <Source id="route" type="geojson" data={geojson}>
      <Layer
        id="route"
        layout={{
          "line-cap": "round",
          "line-join": "round"
        }}
        paint={{
          "line-color": path?.color || routeColor,
          "line-opacity": path?.opacity || 1,
          "line-width": path?.weight || 3
        }}
        type="line"
      />
    </Source>
  ) : (
    <></>
  );
};

export default RouteViewerOverlay;
