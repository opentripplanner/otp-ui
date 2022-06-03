import BaseMap from "@opentripplanner/base-map";
import { UserLocationAndType } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Cat } from "@styled-icons/fa-solid/Cat";
import { Dog } from "@styled-icons/fa-solid/Dog";

import EndpointsOverlay from ".";

import "maplibre-gl/dist/maplibre-gl.css";

// BaseMap props
const center = [45.5215, -122.686202];
const zoom = 16;

// EndpointsOverlay props
const clearLocation = action("clearLocation");
const forgetPlace = action("forgetPlace");
const rememberPlace = action("rememberPlace");
const setLocation = action("setLocation");
const unnamedFromLocation = {
  lat: 45.522497,
  lon: -122.676029,
  type: "work"
};
const fromLocation = {
  ...unnamedFromLocation,
  name: "Portland City Grill"
};
const unnamedToLocation = {
  lat: 45.521049,
  lon: -122.693724,
  type: "home"
};
const toLocation = {
  ...unnamedToLocation,
  name: "Portland Towers"
};
const locations = [fromLocation, toLocation];

function CatDogIcon({ type }: UserLocationAndType) {
  return type === "from" ? <Cat size={40} color="orange" /> : <Dog size={40} />;
}

const withMap = (
  Story: ComponentStory<typeof EndpointsOverlay>
): ReactElement => (
  <BaseMap center={center} zoom={zoom}>
    {/* For some reason, <Story /> does not work with snapshots,
        so use the function syntax instead. */}
    {Story()}
  </BaseMap>
);

export default {
  component: EndpointsOverlay,
  decorators: [withMap],
  title: "EndpointsOverlay"
} as ComponentMeta<typeof EndpointsOverlay>;

export const EndpointsOverlayWithoutUserSettings: ComponentStory<typeof EndpointsOverlay> = () => (
  <EndpointsOverlay
    fromLocation={fromLocation}
    setLocation={setLocation}
    toLocation={toLocation}
  />
);

export const EndpointsOverlayWithUserSettings: ComponentStory<typeof EndpointsOverlay> = () => (
  <EndpointsOverlay
    clearLocation={clearLocation}
    forgetPlace={forgetPlace}
    fromLocation={fromLocation}
    locations={locations}
    rememberPlace={rememberPlace}
    setLocation={setLocation}
    showUserSettings
    toLocation={toLocation}
  />
);

export const EndpointsOverlayWithCustomMapMarkers: ComponentStory<typeof EndpointsOverlay> = () => (
  <EndpointsOverlay
    fromLocation={fromLocation}
    MapMarkerIcon={CatDogIcon}
    setLocation={setLocation}
    toLocation={toLocation}
  />
);

export const EndpointsOverlayWithIntermediatePlace: ComponentStory<typeof EndpointsOverlay> = () => (
  <EndpointsOverlay
    fromLocation={fromLocation}
    intermediatePlaces={[
      {
        lat: 45.523193,
        lon: -122.681538,
        name: "Powell's City of Books",
        type: "intermediate-place-1"
      }
    ]}
    setLocation={setLocation}
    toLocation={toLocation}
  />
);

export const EndpointsOverlayWithUnnamedPlace: ComponentStory<typeof EndpointsOverlay> = () => (
  <EndpointsOverlay
    fromLocation={unnamedFromLocation}
    setLocation={setLocation}
    showUserSettings
    toLocation={unnamedToLocation}
  />
);
