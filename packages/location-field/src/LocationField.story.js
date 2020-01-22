import {
  geocodedFeatureType,
  userLocationType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import {
  Building,
  Clock,
  Crosshairs,
  MapPin,
  MapSigns,
  PlaneArrival,
  PlaneDeparture,
  SkullCrossbones,
  Star,
  Train
} from "styled-icons/fa-solid";

import LocationField from ".";
import * as LocationFieldClasses from "./styled";

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
const getCurrentPosition = action("getCurrentPosition");
const nearbyStops = ["1", "2"];
const onLocationSelected = action("onLocationSelected");
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

const StyledLocationField = styled(LocationField)`
  ${LocationFieldClasses.OptionContainer} {
    font-size: 24px;
    background-color: pink;
  }
`;

function GeocodedOptionIconComponent({ feature }) {
  if (feature.properties.layer === "stops") return <MapSigns size={13} />;
  if (feature.properties.layer === "station") return <Train size={13} />;
  return <MapPin size={13} />;
}

GeocodedOptionIconComponent.propTypes = {
  feature: geocodedFeatureType.isRequired
};

function LocationIconComponent({ locationType }) {
  if (locationType === "from") return <PlaneDeparture size={13} />;
  return <PlaneArrival size={13} />;
}

LocationIconComponent.propTypes = {
  locationType: PropTypes.string.isRequired
};

function UserLocationIconComponent({ userLocation }) {
  if (userLocation.icon === "work") return <Building size={13} />;
  return <Star size={13} />;
}

UserLocationIconComponent.propTypes = {
  userLocation: userLocationType.isRequired
};

storiesOf("LocationField", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("LocationField in desktop context", () => (
    <LocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      inputPlaceholder="Select from location"
      locationType="from"
      onLocationSelected={onLocationSelected}
    />
  ))
  .add("LocationField in mobile context", () => (
    <LocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      locationType="from"
      onLocationSelected={onLocationSelected}
      static
    />
  ))
  .add("Styled LocationField in mobile context", () => (
    <StyledLocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      locationType="from"
      onLocationSelected={onLocationSelected}
      static
    />
  ))
  .add("LocationField with selected location in desktop context", () => (
    <LocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      location={selectedLocation}
      locationType="to"
      onLocationSelected={onLocationSelected}
    />
  ))
  .add("LocationField with selected location in mobile context", () => (
    <LocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      location={selectedLocation}
      locationType="to"
      onLocationSelected={onLocationSelected}
      static
    />
  ))
  .add("LocationField with nearby stops in mobile context", () => (
    <LocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      locationType="to"
      nearbyStops={nearbyStops}
      onLocationSelected={onLocationSelected}
      static
      stopsIndex={stopsIndex}
    />
  ))
  .add("LocationField with session searches in mobile context", () => (
    <LocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      locationType="to"
      onLocationSelected={onLocationSelected}
      sessionSearches={sessionSearches}
      static
    />
  ))
  .add("LocationField with user settings in mobile context", () => (
    <LocationField
      currentPosition={currentPosition}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      locationType="to"
      onLocationSelected={onLocationSelected}
      showUserSettings
      static
      userLocationsAndRecentPlaces={userLocationsAndRecentPlaces}
    />
  ))
  .add("LocationField in mobile context with custom icons", () => (
    <LocationField
      currentPosition={currentPosition}
      currentPositionIcon={<Crosshairs size={13} />}
      currentPositionUnavailableIcon={<SkullCrossbones size={13} />}
      GeocodedOptionIconComponent={GeocodedOptionIconComponent}
      geocoderConfig={geocoderConfig}
      getCurrentPosition={getCurrentPosition}
      LocationIconComponent={LocationIconComponent}
      locationType="to"
      nearbyStops={nearbyStops}
      onLocationSelected={onLocationSelected}
      sessionOptionIcon={<Clock size={13} />}
      sessionSearches={sessionSearches}
      showUserSettings
      static
      stopsIndex={stopsIndex}
      stopOptionIcon={<MapSigns size={13} />}
      userLocationsAndRecentPlaces={userLocationsAndRecentPlaces}
      UserLocationIconComponent={UserLocationIconComponent}
    />
  ));
