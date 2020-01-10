import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import StopViewerOverlay from ".";

import "@opentripplanner/base-map/assets/map.css";

const center = [45.518092, -122.671202];
const zoom = 13;

const stopData = {
  id: "stop-id",
  lat: 45.518,
  lon: -122.671,
  name: "Fake Stop"
};

storiesOf("StopViewerOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("StopViewerOverlay", () => (
    <BaseMap center={center} zoom={zoom}>
      <StopViewerOverlay stopData={stopData} visible />
    </BaseMap>
  ));
