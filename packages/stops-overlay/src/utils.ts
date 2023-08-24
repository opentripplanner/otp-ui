// eslint-disable-next-line import/prefer-default-export
export const isGeoJsonFlex = (geoJson: GeoJSON.GeoJsonObject): boolean =>
  geoJson?.type === "Polygon" || geoJson?.type === "GeometryCollection";
