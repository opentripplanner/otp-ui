import BaseMap from "@opentripplanner/base-map";
import React, { ReactElement } from "react";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryFn } from "@storybook/react";
import { Cat } from "@styled-icons/fa-solid/Cat";
import { Dog } from "@styled-icons/fa-solid/Dog";

import EndpointsOverlay from ".";
import { UserLocationAndType } from "./types";

import "../../../node_modules/leaflet/dist/leaflet.css";

// BaseMap props
const center = [45.5215, -122.686202];
const zoom = 16;

// EndpointsOverlay props
const clearLocation = action("clearLocation");
const forgetPlace = action("forgetPlace");
const rememberPlace = action("rememberPlace");
const setLocation = action("setLocation");
const fromLocation = {
  lat: 45.522497,
  lon: -122.676029,
  name: "Portland City Grill",
  type: "work"
};
const toLocation = {
  lat: 45.521049,
  lon: -122.693724,
  name: "Portland Towers",
  type: "home"
};
const locations = [fromLocation, toLocation];

function CatDogIcon({ type }: UserLocationAndType) {
  return type === "from" ? <Cat size={40} color="orange" /> : <Dog size={40} />;
}

const mapDecorator = (
  story: ComponentStoryFn<typeof EndpointsOverlay>
): ReactElement => (
  <BaseMap center={center} zoom={zoom}>
    {story()}
  </BaseMap>
);

export default {
  component: EndpointsOverlay,
  decorators: [mapDecorator],
  title: "EndpointsOverlay"
} as ComponentMeta<typeof EndpointsOverlay>;

export const EndpointsOverlayWithoutUserSettings = (): ReactElement => (
  <EndpointsOverlay
    fromLocation={fromLocation}
    setLocation={setLocation}
    toLocation={toLocation}
  />
);

export const EndpointsOverlayWithUserSettings = (): ReactElement => (
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

export const EndpointsOverlayWithCustomMapMarkers = (): ReactElement => (
  <EndpointsOverlay
    fromLocation={fromLocation}
    MapMarkerIcon={CatDogIcon}
    setLocation={setLocation}
    toLocation={toLocation}
  />
);

export const EndpointsOverlayWithIntermediatePlace = (): ReactElement => (
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
