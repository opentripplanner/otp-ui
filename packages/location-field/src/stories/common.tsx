import { action } from "@storybook/addon-actions";

export const currentPosition = {
  coords: { latitude: 45.508246, longitude: -122.711574 }
};
export const geocoderConfig = {
  baseUrl: "https://ws-st.trimet.org/pelias/v1", // TriMet-specific default
  boundary: {
    // TriMet-specific default
    rect: {
      minLon: -123.2034,
      maxLon: -122.135,
      minLat: 45.273,
      maxLat: 45.7445
    }
  },
  maxNearbyStops: 4,
  type: "PELIAS"
};

export const hereGeocoderConfig = {
  type: "HERE",
  apiKey: "placeholder_here_key",
  focusPoint: { lat: 47.67552, lng: -122.31831 }
};

export const getCurrentPosition = action("getCurrentPosition");
export const onLocationSelected = action("onLocationSelected");
export const selectedLocation = { lat: 0, lon: 0, name: "123 Main St" };

export const layerColorMap = {
  stops: "purple",
  stations: "navy",
  locality: "orange"
};
