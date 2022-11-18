import { Stop } from "@opentripplanner/types";
import { LngLatBounds } from "maplibre-gl";
import { Layer, LngLatLike, Source, useMap } from "react-map-gl";
import React, { useEffect } from "react";

import polyline from "@mapbox/polyline";
import pointInPolygon from "point-in-polygon";

// helper fn to check if geometry has been populated for all patterns in route
const isGeometryComplete = (routeData: {
  patterns: { id: string; geometry?: { points: [number, number][] } }[];
}) => {
  return (
    routeData?.patterns &&
    Object.values(routeData.patterns).every(
      ptn => typeof ptn?.geometry !== "undefined"
    )
  );
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
 * An overlay that will display all polylines of the patterns of a route.
 */
const RouteViewerOverlay = (props: Props): JSX.Element => {
  const { current } = useMap();
  const { routeData } = props;
  useEffect(() => {
    // if pattern geometry updated, update the map points
    let bounds;
    if (isGeometryComplete(routeData)) {
      const allPoints: LngLatLike[] = Object.values(routeData.patterns).reduce(
        (acc, ptn) => {
          return acc.concat(polyline.decode(ptn.geometry.points));
        },
        []
      );

      if (allPoints.length > 0) {
        const geoJsonedPoints: [number, number][] = allPoints.map(c => {
          return [c[1], c[0]];
        });
        bounds = geoJsonedPoints.reduce((bnds, coord) => {
          return bnds.extend(coord);
        }, new LngLatBounds(geoJsonedPoints[0], geoJsonedPoints[0]));
      }
    }

    // if pattern geometry updated, update the map points
    if (bounds && current) {
      const canvas = current.getCanvas();
      // @ts-expect-error getOixelRatio not defeined in MapRef type.
      const pixelRatio = current.getPixelRatio();
      const horizPadding = canvas.width / pixelRatio / 10;
      const vertPadding = canvas.height / pixelRatio / 10;

      current.fitBounds(bounds, {
        duration: 500,
        padding: {
          left: horizPadding,
          right: horizPadding,
          top: vertPadding,
          bottom: vertPadding
        }
      });

      // Often times, the map is not updated right away, so try to force an update.
      current.triggerRepaint();

      if (props.mapCenterCallback) {
        props.mapCenterCallback();
      }
    }
  }, [routeData, routeData.patterns, current]);

  const { clipToPatternStops, path } = props;

  // Null can't be returned here -- react-map-gl dislikes null values as children
  if (!routeData || !routeData.patterns) return <></>;

  const routeColor = routeData.color
    ? `#${routeData.color}`
    : path?.color || "#00bfff";
  const segments = Object.values(routeData.patterns)
    .filter(pattern => !!pattern?.geometry)
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
    <>
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
    </>
  ) : null;
};

type RouteData = {
  color?: string;
  patterns: {
    id: string;
    geometry?: { points: [number, number][] };
    stops?: Stop[];
  }[];
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

export default RouteViewerOverlay;
