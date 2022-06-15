import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { action } from "@storybook/addon-actions";

import ParkAndRideOverlay from ".";
import parkAndRideLocations from "../__mocks__/park-and-rides.json";

import "maplibre-gl/dist/maplibre-gl.css";

const center = [45.518092, -122.671202];
const zoom = 13;

export default {
  title: "ParkAndRideOverlay",
  component: ParkAndRideOverlay
};

export const Default = () => (
  <BaseMap center={center} forceMaxHeight zoom={zoom}>
    <ParkAndRideOverlay
      parkAndRideLocations={parkAndRideLocations}
      setLocation={action("setLocation")}
      visible
    />
  </BaseMap>
);
