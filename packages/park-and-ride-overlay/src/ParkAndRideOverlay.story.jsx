import React from "react";
import { action } from "@storybook/addon-actions";

import parkAndRideLocations from "../__mocks__/park-and-rides.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import ParkAndRideOverlay from ".";

const center = [45.518092, -122.671202];
const zoom = 13;

export default {
  title: "ParkAndRideOverlay",
  component: ParkAndRideOverlay,
  decorators: [withMap(center, zoom)],
  parameters: { storyshots: { disable: true } }
};

export const Default = () => (
  <ParkAndRideOverlay
    parkAndRideLocations={parkAndRideLocations}
    setLocation={action("setLocation")}
    visible
  />
);
