import BaseMap from "@opentripplanner/base-map";
import { stopLayerStopType } from "@opentripplanner/core-utils/lib/types";
import React from "react";
import { CircleMarker } from "react-leaflet";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import DefaultStopMarker from "./default-stop-marker";
import StopViewerOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.518092, -122.671202];
const zoom = 13;

const fakeStop = {
  id: "stop-id",
  lat: 45.518,
  lon: -122.671,
  name: "Fake Stop"
};

function CustomMarker({ stop }) {
  return <CircleMarker center={[stop.lat, stop.lon]} key={stop.id} />;
}

CustomMarker.propTypes = {
  stop: stopLayerStopType.isRequired
};

storiesOf("StopViewerOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("StopViewerOverlay", () => (
    <BaseMap center={center} zoom={zoom}>
      <StopViewerOverlay
        stop={fakeStop}
        StopMarker={DefaultStopMarker}
        visible
      />
    </BaseMap>
  ))
  .add("StopViewerOverlay with custom marker", () => (
    <BaseMap center={center} zoom={zoom}>
      <StopViewerOverlay stop={fakeStop} StopMarker={CustomMarker} visible />
    </BaseMap>
  ));
