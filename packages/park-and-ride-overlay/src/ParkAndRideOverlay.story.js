import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import ParkAndRideOverlay from ".";

import "@opentripplanner/base-map/assets/map.css";

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function makeRandomParkAndRide(mapVal, idx) {
  return {
    name: `Park and Ride ${idx}`,
    x: randomRange(-122.6, -122.75),
    y: randomRange(45.507, 45.531)
  };
}

const center = [45.518092, -122.671202];
const zoom = 13;

const parkAndRideLocations = Array(5)
  .fill(null)
  .map(makeRandomParkAndRide);

storiesOf("ParkAndRideOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ParkAndRideOverlay", () => (
    <BaseMap center={center} zoom={zoom}>
      <ParkAndRideOverlay
        parkAndRideLocations={parkAndRideLocations}
        setLocation={action("setLocation")}
        visible
      />
    </BaseMap>
  ));
