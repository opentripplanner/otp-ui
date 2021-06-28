import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";
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

import LocationField from "..";
import {
  currentPosition,
  geocoderConfig,
  getCurrentPosition,
  onLocationSelected,
  selectedLocation
} from "./common";
import * as LocationFieldClasses from "../styled";

const nearbyStops = ["1", "2"];
const sessionSearches = [
  {
    lat: 12.34,
    lon: 34.45,
    name: "123 Main St"
  }
];
const stopsIndex = {
  1: {
    code: "1",
    dist: 123,
    lat: 12.34,
    lon: 34.56,
    name: "1st & Main",
    routes: [{ shortName: "1" }]
  },
  2: {
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

function GeocodedOptionIconComponent({ feature }) {
  if (feature.properties.layer === "stops") return <MapSigns size={13} />;
  if (feature.properties.layer === "station") return <Train size={13} />;
  return <MapPin size={13} />;
}

GeocodedOptionIconComponent.propTypes = {
  feature: coreUtils.types.geocodedFeatureType.isRequired
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
  userLocation: coreUtils.types.userLocationType.isRequired
};

const StyledLocationField = styled(LocationField)`
  ${LocationFieldClasses.OptionContainer} {
    font-size: 24px;
    background-color: pink;
  }
`;

export default {
  title: "LocationField/Mobile Context",
  component: LocationField
};

export const Blank = () => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    locationType="from"
    onLocationSelected={onLocationSelected}
    static
  />
);

export const Styled = () => (
  <StyledLocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    locationType="from"
    onLocationSelected={onLocationSelected}
    static
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
    static
  />
);

export const WithNearbyStops = () => (
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
);

export const WithSessionSearches = () => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    locationType="to"
    onLocationSelected={onLocationSelected}
    sessionSearches={sessionSearches}
    static
  />
);

export const WithUserSettings = () => (
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
);

export const WithCustomIcons = () => (
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
);
