import polyline from "@mapbox/polyline";
import { SymbolLayout } from "mapbox-gl";
import { TransitivePattern, TransitiveRoute } from "@opentripplanner/types";

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
  // spaces are replaced with '!' (~same width as space) to create a background with a uniform height.
  // Also, ensure there is a minimum background width (3 characters).
  const routeNameUpper = (routeName.length < 3 ? "000" : routeName)
    .toUpperCase()
    .replace(/\s/g, "!");

  return {
    geometry: polyline.toGeoJSON(polyline.encode(concatenatedLines)),
    properties: {
      color: `#${route.route_color || "000080"}`,
      name: routeName,
      nameUpper: routeNameUpper,
      routeType: route.route_type,
      textColor: `#${route.route_text_color || "eee"}`,
      type: "route"
    },
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
