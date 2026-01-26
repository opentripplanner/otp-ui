import polyline from "@mapbox/polyline";
import { ExpressionSpecification, SymbolLayerSpecification } from "maplibre-gl";
import { TransitivePattern, TransitiveRoute } from "@opentripplanner/types";

import { drawArc } from "./util";

/**
 * Create a labeled-line feature for the given transit route pattern
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

  const properties = {
    color: `#${route.route_color || "000080"}`,
    name: routeName,
    routeType: route.route_type,
    textColor: `#${route.route_text_color || "eee"}`,
    type: "route"
  };

  const isFlex = pattern.stops[pattern.stops.length - 1].stop_id?.endsWith(
    "flexed_to"
  );
  const straight = polyline.toGeoJSON(polyline.encode(concatenatedLines));

  return {
    geometry: isFlex ? drawArc(straight) : straight,
    properties,
    type: "Feature"
  };
}

/**
 * Obtains common layout options for route label layers.
 */
export function getRouteLayerLayout(
  textField: string
): SymbolLayerSpecification["layout"] {
  // Generates a single icon based on the string length
  function generateIcon(length: number) {
    return [["==", ["length", ["get", textField]], length], `${length}`];
  }

  // Generates every icon length from 1-17. Anything higher renders a rectangle
  const iconImage = [
    "case",
    ...Array(17)
      .fill(0)
      .map((_, i) => generateIcon(i + 1))
      .flat(),
    "rect"
  ];

  // TODO: Tweak shape of roundels for perfect circle
  return {
    "icon-image": iconImage as ExpressionSpecification,
    "icon-optional": false,
    "icon-allow-overlap": false,
    "icon-rotation-alignment": "viewport",
    "icon-text-fit-padding": [11, 10, 11, 10],
    "icon-text-fit": "both",
    "symbol-placement": "line-center",
    "symbol-spacing": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      250,
      10,
      225,
      20,
      220
    ] as ExpressionSpecification,
    "text-allow-overlap": true,
    "text-field": ["get", textField],
    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
    "text-ignore-placement": true,
    "text-justify": "left",
    "text-line-height": 0.5,
    "text-letter-spacing": 0,
    "text-padding": 0,
    "text-rotation-alignment": "viewport",
    "text-size": 13
  };
}
