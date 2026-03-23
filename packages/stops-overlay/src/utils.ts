// eslint-disable-next-line import/prefer-default-export
export const isGeoJsonFlex = (geoJson: GeoJSON.GeoJsonObject): boolean =>
  ["Polygon", "GeometryCollection", "MultiPolygon"].includes(geoJson?.type);
