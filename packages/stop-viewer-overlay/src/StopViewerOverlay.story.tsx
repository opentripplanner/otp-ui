import BaseMap, { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import React from "react";

import { Marker } from "react-map-gl";
import DefaultStopMarker from "./default-stop-marker";
import StopViewerOverlay, { StopContainer } from ".";

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
  component: StopViewerOverlay
};

export const Default = (): JSX.Element => (
  <BaseMapStyled.StoryMapContainer>
    <BaseMap center={center} zoom={zoom}>
      <StopViewerOverlay
        stop={fakeStop}
        StopMarker={DefaultStopMarker}
        visible
      />
    </BaseMap>
  </BaseMapStyled.StoryMapContainer>
);

const WithCustomMarker = (): JSX.Element => (
  <BaseMapStyled.StoryMapContainer>
    <BaseMap center={center} zoom={zoom}>
      <StopViewerOverlay stop={fakeStop} StopMarker={CustomMarker} visible />
    </BaseMap>
  </BaseMapStyled.StoryMapContainer>
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
