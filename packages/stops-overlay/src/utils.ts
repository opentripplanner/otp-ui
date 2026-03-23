// eslint-disable-next-line import/prefer-default-export
export const isGeoJsonFlex = (
  geoJson?: GeoJSON.GeoJsonObject | null
): boolean =>
  ["Polygon", "GeometryCollection", "MultiPolygon"].includes(geoJson?.type);
