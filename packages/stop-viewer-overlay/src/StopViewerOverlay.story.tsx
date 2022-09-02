import React from "react";

import { Marker } from "react-map-gl";
import DefaultStopMarker from "./default-stop-marker";
import StopViewerOverlay, { StopContainer } from ".";
import { withMap } from "../../../.storybook/base-map-wrapper";

const center: [number, number] = [45.518092, -122.671202];
const zoom = 13;

const fakeStop = {
  id: "stop-id",
  lat: 45.518,
  lon: -122.671,
  name: "Fake Stop"
};

function CustomMarker({ stop }: StopContainer) {
  return <Marker longitude={stop.lon} latitude={stop.lat} key={stop.id} />;
}

export default {
  title: "StopViewerOverlay",
  component: StopViewerOverlay,
  decorators: [withMap(center, zoom)]
};

export const Default = (): JSX.Element => (
  <StopViewerOverlay stop={fakeStop} StopMarker={DefaultStopMarker} visible />
);

const WithCustomMarker = (): JSX.Element => (
  <StopViewerOverlay stop={fakeStop} StopMarker={CustomMarker} visible />
);
// Can be disabled as this is a storybook-only marker
const disableA11yParameters = {
  a11y: {
    config: {
      rules: [{ id: "aria-allowed-attr", enabled: false }]
    }
  }
};

WithCustomMarker.parameters = disableA11yParameters;
export { WithCustomMarker };
