import React from "react";

import LocationField from "..";
import {
  currentPosition,
  geocoderConfig,
  getCurrentPosition,
  onLocationSelected,
  selectedLocation
} from "./common";

const invalidKeyGeocoderConfig = {
  apiKey: "ge-invalid-key",
  baseUrl: "https://api.geocode.earth/v1", // TriMet-specific default
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

export default {
  title: "LocationField/Desktop Context",
  component: LocationField
};

export const Blank = () => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const SelectedLocation = () => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    location={selectedLocation}
    locationType="to"
    onLocationSelected={onLocationSelected}
  />
);

export const NoAutoFocusWithMultipleControls = () => (
  <div>
    <input id="example" defaultValue="Enter text" />
    <button type="button">Click me!</button>
    <LocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      inputPlaceholder="Select from location"
      locationType="from"
      onLocationSelected={onLocationSelected}
    />
  </div>
);

export const AutoFocusWithMultipleControls = () => (
  <div>
    <input id="example" defaultValue="Enter text" />
    <button type="button">Click me!</button>
    <LocationField
      autoFocus
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      inputPlaceholder="Select from location"
      locationType="from"
      onLocationSelected={onLocationSelected}
    />
  </div>
);

export const WithBadApiKeyHandlesBadAutocomplete = () => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={invalidKeyGeocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);
