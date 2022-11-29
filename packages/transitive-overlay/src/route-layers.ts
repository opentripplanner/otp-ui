import polyline from "@mapbox/polyline";
import { SymbolLayout } from "mapbox-gl";
import { TransitivePattern, TransitiveRoute } from "@opentripplanner/types";

import lineArc from "@turf/line-arc";
import lineDistance from "@turf/line-distance";
import midpoint from "@turf/midpoint";
import destination from "@turf/destination";
import bearing from "@turf/bearing";
import distance from "@turf/distance";

/**
 * Create a labeled-line feature for the given transit route pattern.
 */
export function patternToRouteFeature(
  pattern: TransitivePattern,
  routes: TransitiveRoute[]
): GeoJSON.Feature<GeoJSON.Geometry, Record<string, unknown>> {
  const route = routes.find(r => r.route_id === pattern.route_id);
  // Concatenate geometries (arrays of coordinates) to help maplibre spread out labels (not perfect).
  const concatenatedLines = pattern.stops
    .map(stop => stop.geometry)
    .filter(geometry => !!geometry)
    .reduce((result, geom, index) => {
      const coords = polyline.decode(geom);
      // Remove the first element (except for the first array) because it is a duplicate
      // of the last element of the previous array.
      if (index !== 0) coords.shift();
      return result.concat(coords);
    }, []);
  const routeName = route.route_short_name || route.route_long_name || "";
  // HACK: Create an uppercase version of the route name to paint the background, where
  // - spaces are replaced with '!' (~same width as space)
  // - "+", "-", certain letters and numbers are replaced with "E" to create a background with a uniform height and fill.
  // Also, ensure there is a minimum background width (3 characters).
  // Disclaimer: height of substitution characters can vary from font to font.
  const routeNameUpper = (routeName.length < 3 ? "EEE" : routeName)
    .toUpperCase()
    .replace(/\s/g, "!")
    .replace(/[+-0124679FHJLPTVXYZ]/g, "E");

  const properties = {
    color: `#${route.route_color || "000080"}`,
    name: routeName,
    nameUpper: routeNameUpper,
    routeType: route.route_type,
    textColor: `#${route.route_text_color || "eee"}`,
    type: "route"
  };

  const isFlex = pattern.stops[pattern.stops.length - 1].stop_id.includes(
    "flexed_to"
  );
  const straight = polyline.toGeoJSON(polyline.encode(concatenatedLines));

  if (isFlex) {
    // Create clone of plain route that only includes first and last point
    const extraStraight = { ...straight };
    extraStraight.coordinates = [
      extraStraight.coordinates[0],
      extraStraight.coordinates[extraStraight.coordinates.length - 1]
    ];

    // Adapted from https://github.com/Turfjs/turf/issues/1218#issuecomment-592421977
    const length = lineDistance(extraStraight, "kilometers");
    const mp = midpoint(
      extraStraight.coordinates[0],
      extraStraight.coordinates[1]
    );
    const center = destination(
      mp,
      length,
      bearing(extraStraight.coordinates[0], extraStraight.coordinates[1]) - 90
    );

    const arc = lineArc(
      center,
      distance(center, extraStraight.coordinates[0]),
      bearing(center, extraStraight.coordinates[1]),
      bearing(center, extraStraight.coordinates[0]),
      { steps: 500 }
    ).geometry;

    return {
      geometry: arc,
      properties,
      type: "Feature"
    };
  }

  return {
    geometry: straight,
    properties,
    type: "Feature"
  };
}

/**
 * Obtains common layout options for route label layers.
 */
export function getRouteLayerLayout(textField: string): SymbolLayout {
  return {
    "symbol-placement": "line-center",
    "text-allow-overlap": true,
    "text-field": ["get", textField],
    "text-ignore-placement": true,
    "text-rotation-alignment": "viewport",
    "text-size": 16
  };
}
