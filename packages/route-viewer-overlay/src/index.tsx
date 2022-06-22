import React, { useEffect } from "react";
import { Stop } from "@opentripplanner/types";
import { Source, Layer, useMap, LngLatLike } from "react-map-gl";
import { LngLatBounds } from "maplibre-gl";

import polyline from "@mapbox/polyline";
import pointInPolygon from "point-in-polygon";

// helper fn to check if geometry has been populated for all patterns in route
const isGeomComplete = (routeData: {
  patterns: { id: string; geometry?: { points: [number, number][] } }[];
}) => {
  return (
    routeData &&
    routeData.patterns &&
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
      ?.map(stop => {
        if (stop.geometries?.geoJson?.type !== "Polygon") {
          return null;
        }
        return stop.geometries.geoJson.coordinates?.[0] || null;
      })
      // Remove the null entries
      .filter(bbox => !!bbox) || [];

  // Points we keep can't be in any of the flex zones
  return points.filter(point => {
    const [y, x] = point;
    return bboxes.every(bbox => !pointInPolygon([x, y], bbox));
  });
};

/**
 * An overlay that will display all polylines of the patterns of a route.
 */
const RouteViewerOverlay = (props: Props): JSX.Element => {
  const { mainMap } = useMap();
  const { routeData } = props;
  useEffect(() => {
    // if pattern geometry updated, update the map points
    if (isGeomComplete(routeData)) {
      const allPoints: LngLatLike[] = Object.values(routeData.patterns).reduce(
        (acc, ptn) => {
          return acc.concat(polyline.decode(ptn.geometry.points));
        },
        []
      );
      if (allPoints.length > 0) {
        const geoJsonedPoints: [number, number][] = allPoints.map(c => [
          c[1],
          c[0]
        ]);
        const bounds = geoJsonedPoints.reduce((bnds, coord) => {
          return bnds.extend(coord);
        }, new LngLatBounds(geoJsonedPoints[0], geoJsonedPoints[0]));

        mainMap?.fitBounds(bounds, {
          duration: 300,
          padding: { top: 30, bottom: 30, left: 30, right: 30 }
        });

        if (props.mapCenterCallback) {
          props.mapCenterCallback();
        }
      }
    }
  }, [routeData.patterns]);

  const { clipToPatternStops, path } = props;

  if (!routeData || !routeData.patterns) return <></>;

  const routeColor = routeData.color
    ? `#${routeData.color}`
    : path?.color || "#00bfff";
  const segments = [];
  Object.values(routeData.patterns).forEach(pattern => {
    if (!pattern?.geometry) return;
    const pts = polyline.decode(pattern.geometry.points);
    const clippedPts = clipToPatternStops
      ? removePointsInFlexZone(pattern?.stops, pts)
      : pts;

    segments.push(clippedPts.map((pt: [number, number]) => [pt[1], pt[0]]));
  });

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: segments.map(segment => ({
      type: "Feature",
      properties: [],
      geometry: {
        type: "LineString",
        coordinates: segment
      }
    }))
  };

  return segments.length > 0 ? (
    <>
      <Source id="route" type="geojson" data={geojson}>
        <Layer
          id="route"
          type="line"
          layout={{ "line-join": "round", "line-cap": "round" }}
          paint={{
            "line-color": path?.color || routeColor,
            "line-width": path?.weight || 3,
            "line-opacity": path?.opacity || 1
          }}
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
