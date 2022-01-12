import { LatLngBounds } from "leaflet";

// https://github.com/mapbox/vt2geojson for tiles

type MapillaryResponse = {
  data: [GeoJSON.Feature];
};

// eslint-disable-next-line import/prefer-default-export
export const getImages = async (
  bounds: LatLngBounds
): Promise<MapillaryResponse> => {
  const apiResponse = await fetch(
    `https://graph.mapillary.com/images?fields=id,geometry&bbox=${
      bounds.getSouthWest().lng
    },${bounds.getSouthWest().lat},${bounds.getNorthEast().lng},${
      bounds.getNorthEast().lat
    }&access_token=[TODO INSERT ME FROM PROPS]`
  );
  return apiResponse.json();
};
