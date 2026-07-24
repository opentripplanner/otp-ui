import { Stop } from "@opentripplanner/types";

export const hasCoordinates = (
  s: Stop
): s is Stop & { lat: number; lon: number } =>
  s.lat !== null &&
  s.lat !== undefined &&
  s.lon !== null &&
  s.lon !== undefined;

export const isGeoJsonFlex = (
  geoJson?: GeoJSON.GeoJsonObject | null
): boolean =>
  !!geoJson?.type &&
  ["Polygon", "GeometryCollection", "MultiPolygon"].includes(geoJson.type);
