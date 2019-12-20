import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import LocationField from ".";

const currentPosition = {
  coords: { latitude: 45.508246, longitude: -122.711574 }
};
const geocoderConfig = {
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
const nearbyStops = ["1", "2"];
const selectedLocation = { name: "123 Main St" };
const sessionSearches = [
  {
    lat: 12.34,
    lon: 34.45,
    name: "123 Main St"
  }
];
const stopsIndex = {
  "1": {
    code: "1",
    dist: 123,
    lat: 12.34,
    lon: 34.56,
    name: "1st & Main",
    routes: [{ shortName: "1" }]
  },
  "2": {
    code: "2",
    dist: 345,
    lat: 23.45,
    lon: 67.89,
    name: "Main & 2nd",
    routes: [{ shortName: "2" }]
  }
};
const userLocationsAndRecentPlaces = [
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
    lat: 12.34,
    lon: 34.45,
    name: "123 Main St",
    type: "recent"
  }
];

function LocationFieldStoryWrapper(props) {
  return (
    <LocationField
      geocoderConfig={geocoderConfig}
      getCurrentPosition={action("getCurrentPosition")}
      inputPlaceholder="Select from location"
      locationType="from"
      onLocationSelected={action("onLocationSelected")}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  );
}

storiesOf("LocationField", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("LocationField in desktop context", () => (
    <LocationFieldStoryWrapper currentPosition={currentPosition} />
  ))
  .add(
    "LocationField in desktop context (current position unavailable)",
    () => <LocationFieldStoryWrapper />
  )
  .add("LocationField in mobile context", () => (
    <LocationFieldStoryWrapper currentPosition={currentPosition} static />
  ))
  .add("LocationField with selected location in desktop context", () => (
    <LocationFieldStoryWrapper
      currentPosition={currentPosition}
      location={selectedLocation}
      locationType="to"
    />
  ))
  .add("LocationField with selected location in mobile context", () => (
    <LocationFieldStoryWrapper
      currentPosition={currentPosition}
      location={selectedLocation}
      locationType="to"
      static
    />
  ))
  .add("LocationField with nearby stops in mobile context", () => (
    <LocationFieldStoryWrapper
      currentPosition={currentPosition}
      locationType="to"
      nearbyStops={nearbyStops}
      static
      stopsIndex={stopsIndex}
    />
  ))
  .add("LocationField with session searches in mobile context", () => (
    <LocationFieldStoryWrapper
      currentPosition={currentPosition}
      locationType="to"
      sessionSearches={sessionSearches}
      static
    />
  ))
  .add("LocationField with user settings in mobile context", () => (
    <LocationFieldStoryWrapper
      currentPosition={currentPosition}
      locationType="to"
      showUserSettings
      static
      userLocationsAndRecentPlaces={userLocationsAndRecentPlaces}
    />
  ));
