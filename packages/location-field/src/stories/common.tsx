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

export const unreachableGeocoderConfig = {
  ...geocoderConfig,
  // Putting an erroneous URL on purpose.
  baseUrl: "https://www.example.com/pelias/v1"
};

export const slowGeocoderConfig = {
  ...geocoderConfig,
  // URL to a simulated slow geocoder (see handlers.js).
  baseUrl: "https://slow.trimet.org/pelias/v1"
};

export const hereGeocoderConfig = {
  type: "HERE",
  apiKey: "placeholder_here_key",
  focusPoint: { lat: 47.67552, lng: -122.31831 }
};

export const badGeocoderConfig = {
  type: "BAD",
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

export const userLocationsAndRecentPlaces = [
  {
    icon: "home",
    lat: 45.89,
    lon: 67.12,
    name: "456 Suburb St",
    type: "home"
  },
  {
    icon: "work",
    lat: 54.32,
    lon: 43.21,
    name: "789 Busy St",
    type: "work"
  },
  {
    icon: "map-marker",
    lat: 34.22,
    lon: -84.11,
    name: "Coffee Roasters Shop, 55 Coffee Street",
    type: "custom"
  },
  {
    lat: 12.34,
    lon: 34.45,
    name: "123 Main St",
    type: "recent"
  }
];
