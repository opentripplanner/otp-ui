import React from "react";
import { ComponentMeta } from "@storybook/react";

import { Ship } from "@styled-icons/fa-solid/Ship";
import { Bus } from "@styled-icons/fa-solid/Bus";
import LocationField from "..";
import {
  badGeocoderConfig,
  currentPosition,
  geocoderConfig,
  getCurrentPosition,
  hereGeocoderConfig,
  layerColorMap,
  onLocationSelected,
  selectedLocation,
  slowGeocoderConfig,
  unreachableGeocoderConfig,
  userLocationsAndRecentPlaces
} from "./common";

import mockedGeocoderResponse from "../mocks/autocomplete.json";

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

const a11yOverrideParameters = {
  a11y: {
    config: {
      rules: [
        // This is a story issue, not a production issue
        { id: "label", enabled: false },
        // The options don't appear until click
        { id: "aria-required-children", enabled: false }
      ]
    }
  }
};

export default {
  component: LocationField,
  parameters: {
    // Hide all controls
    // (there are no args that the user can interactively change for this component).
    controls: {
      hideNoControlsWarning: true,
      include: []
    }
  },
  title: "LocationField/Desktop Context"
} as ComponentMeta<typeof LocationField>;

export const Blank = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const LocationUnavailable = (): JSX.Element => (
  <LocationField
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const HereGeocoder = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={hereGeocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const GeocoderNoResults = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={badGeocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const GeocoderUnreachable = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={unreachableGeocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const SlowGeocoder = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={slowGeocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
    showSecondaryLabels={false}
  />
);

export const SelectedLocation = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    location={selectedLocation}
    locationType="to"
    onLocationSelected={onLocationSelected}
  />
);

export const SelectedLocationCustomClear = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    location={selectedLocation}
    locationType="to"
    onLocationSelected={onLocationSelected}
    clearButtonIcon={<Bus size={13} />}
  />
);

export const NoAutoFocusWithMultipleControls = (): JSX.Element => (
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
NoAutoFocusWithMultipleControls.parameters = a11yOverrideParameters;

export const AutoFocusWithMultipleControls = (): JSX.Element => (
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
AutoFocusWithMultipleControls.parameters = a11yOverrideParameters;

export const WithBadApiKeyHandlesBadAutocomplete = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={invalidKeyGeocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

// TODO: add custom messages once that becomes easier with the react-intl plugin
export const WithCustomResultColorsAndIcons = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    layerColorMap={{ stops: "green", stations: "orange" }}
    locationType="from"
    onLocationSelected={onLocationSelected}
    operatorIconMap={{ "wa-state-ferry": <Ship size={13} /> }}
  />
);

export const WithPrefilledSearch = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    initialSearchResults={mockedGeocoderResponse.features}
    inputPlaceholder="Select from location"
    layerColorMap={layerColorMap}
    locationType="from"
    onLocationSelected={onLocationSelected}
    preferredLayers={["example_layer"]}
    sortByDistance
    style={{ fontFamily: "sans-serif" }}
  />
);
WithPrefilledSearch.parameters = a11yOverrideParameters;

export const RequiredAndInvalidState = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={unreachableGeocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    isRequired
    isValid={false}
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const WithUserSettings = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    inputPlaceholder="Select from location"
    locationType="from"
    onLocationSelected={onLocationSelected}
    showUserSettings
    userLocationsAndRecentPlaces={userLocationsAndRecentPlaces}
  />
);

export const WithCustomResultsOrder = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    geocoderResultsOrder={["OTHER", "STATIONS", "STOPS"]}
    getCurrentPosition={getCurrentPosition}
    initialSearchResults={mockedGeocoderResponse.features}
    inputPlaceholder="Select from location"
    layerColorMap={layerColorMap}
    locationType="from"
    onLocationSelected={onLocationSelected}
    preferredLayers={["example_layer"]}
    sortByDistance
    style={{ fontFamily: "sans-serif" }}
  />
);

WithCustomResultsOrder.parameters = a11yOverrideParameters;
