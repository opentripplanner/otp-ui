import polyline from "@mapbox/polyline";
import { SymbolLayout } from "mapbox-gl";
import { TransitivePattern, TransitiveRoute } from "@opentripplanner/types";

import { drawArc } from "./util";

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
export function getRouteLayerLayout(textField: string): SymbolLayout {
  return {
    // "icon-image": "debug",
    "icon-image": [
      "case",
      ["==", ["length", ["get", textField]], 1],
      "circle-1",
      ["==", ["length", ["get", textField]], 2],
      "circle-2",
      ["==", ["length", ["get", textField]], 3],
      "circle-3",
      "rect"
    ],
    "icon-optional": false,
    // @ts-expect-error maplibre is not typed correctly
    "icon-overlap": "always",
    "icon-text-fit": "both",
    "symbol-placement": "line-center",
    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
    "text-field": ["get", textField],
    "text-ignore-placement": true,
    "text-justify": "center",
    "text-overlap": "always",
    "text-rotation-alignment": "viewport",
    "icon-rotation-alignment": "viewport",
    "text-padding": 0,
    "text-allow-overlap": true,
    "icon-text-fit-padding": [0, 0, 0, 0],
    // "font-scale": 1.0,
    "text-size": 16
  };
}
