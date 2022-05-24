import React from "react";
import { ComponentMeta } from "@storybook/react";
import styled from "styled-components";
import {
  Building,
  Bus,
  Clock,
  Crosshairs,
  MapPin,
  MapSigns,
  PlaneArrival,
  PlaneDeparture,
  SkullCrossbones,
  Star,
  Train,
} from "styled-icons/fa-solid";

import { GeocodedFeature, Stop, UserLocation } from "@opentripplanner/types";
import LocationField from "..";
import {
  currentPosition,
  geocoderConfig,
  getCurrentPosition,
  layerColorMap,
  onLocationSelected,
  selectedLocation
} from "./common";
import * as LocationFieldClasses from "../styled";

// eslint-disable-next-line prettier/prettier
import type { LocationType } from "../types"

const nearbyStops = ["1", "2"];
const sessionSearches = [
  {
    lat: 12.34,
    lon: 34.45,
    name: "123 Main St"
  }
];
const stopsIndex: { [key: string]: Stop } = {
  1: {
    code: "1",
    dist: 123,
    lat: 12.34,
    lon: 34.56,
    name: "1st & Main",
    // @ts-expect-error demo data can be missing some fields
    routes: [{ shortName: "1" }]
  },
  2: {
    code: "2",
    dist: 345,
    lat: 23.45,
    lon: 67.89,
    name: "Main & 2nd",
    // @ts-expect-error demo data can be missing some fields
    routes: [{ shortName: "2" }]
  }
};
const userLocationsAndRecentPlaces: UserLocation[] = [
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

function GeocodedOptionIconComponent({ feature }: { feature: GeocodedFeature }) {
  if (feature.properties.layer === "stops") return <MapSigns size={13} />;
  if (feature.properties.layer === "station") return <Train size={13} />;
  return <MapPin size={13} />;
}


function LocationIconComponent({ locationType }: { locationType: LocationType }) {
  if (locationType === "from") return <PlaneDeparture size={13} />;
  return <PlaneArrival size={13} />;
}

function UserLocationIconComponent({ userLocation }: { userLocation: UserLocation }) {
  if (userLocation.icon === "work") return <Building size={13} />;
  return <Star size={13} />;
}


const StyledLocationField = styled(LocationField)`
  ${LocationFieldClasses.OptionContainer} {
    background-color: pink;
    font-size: 24px;
  }
`;

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
  title: "LocationField/Mobile Context",
} as ComponentMeta<typeof LocationField>;

export const Blank = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    isStatic
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const Styled = (): JSX.Element => (
  <StyledLocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    isStatic
    layerColorMap={layerColorMap}
    locationType="from"
    onLocationSelected={onLocationSelected}
  />
);

export const SelectedLocation = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    isStatic
    layerColorMap={layerColorMap}
    location={selectedLocation}
    locationType="to"
    onLocationSelected={onLocationSelected}
  />
);

export const SelectedLocationCustomClear = (): JSX.Element => (
  <LocationField
    clearButtonIcon={<Bus size={13} />}
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    isStatic
    location={selectedLocation}
    locationType="to"
    onLocationSelected={onLocationSelected}
  />
);

export const WithNearbyStops = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    isStatic
    layerColorMap={layerColorMap}
    locationType="to"
    nearbyStops={nearbyStops}
    onLocationSelected={onLocationSelected}
    stopsIndex={stopsIndex}
  />
);

export const WithSessionSearches = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    isStatic
    layerColorMap={layerColorMap}
    locationType="to"
    onLocationSelected={onLocationSelected}
    sessionSearches={sessionSearches}
  />
);

export const WithUserSettings = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    isStatic
    layerColorMap={layerColorMap}
    locationType="to"
    onLocationSelected={onLocationSelected}
    showUserSettings
    userLocationsAndRecentPlaces={userLocationsAndRecentPlaces}
  />
);

export const WithCustomIcons = (): JSX.Element => (
  <LocationField
    currentPosition={currentPosition}
    currentPositionIcon={<Crosshairs size={13} />}
    currentPositionUnavailableIcon={<SkullCrossbones size={13} />}
    GeocodedOptionIconComponent={GeocodedOptionIconComponent}
    geocoderConfig={geocoderConfig}
    getCurrentPosition={getCurrentPosition}
    isStatic
    layerColorMap={layerColorMap}
    LocationIconComponent={LocationIconComponent}
    locationType="to"
    nearbyStops={nearbyStops}
    onLocationSelected={onLocationSelected}
    sessionOptionIcon={<Clock size={13} />}
    sessionSearches={sessionSearches}
    showUserSettings
    stopOptionIcon={<MapSigns size={13} />}
    stopsIndex={stopsIndex}
    UserLocationIconComponent={UserLocationIconComponent}
    userLocationsAndRecentPlaces={userLocationsAndRecentPlaces}
  />
);
