import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import ParkAndRideOverlay from ".";
import parkAndRideLocations from "../__mocks__/park-and-rides.json";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.518092, -122.671202];
const zoom = 13;

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
