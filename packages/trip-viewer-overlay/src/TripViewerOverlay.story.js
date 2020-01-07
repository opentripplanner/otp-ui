import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import tripData from "../__mocks__/mock-trip.json";
import TripViewerOverlay from ".";

import "@opentripplanner/base-map/assets/map.css";

const center = [45.518092, -122.671202];
const zoom = 13;

storiesOf("TripViewerOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("TripViewerOverlay", () => (
    <BaseMap center={center} zoom={zoom}>
      <TripViewerOverlay tripData={tripData} visible />
    </BaseMap>
  ));
