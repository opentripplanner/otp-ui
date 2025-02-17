import React from "react";
import { action } from "@storybook/addon-actions";

import mockStops from "../__mocks__/stops.json";
import mockFlexStops from "../__mocks__/flex-stops.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import StopsOverlay, { StopProps } from ".";

const center: [number, number] = [45.523092, -122.671202];

const Example = ({
  highlightedStop = "8338",
  minZoom = 15,
  setLocation = action("setLocation"),
  setViewedStop = action("setViewedStop"),
  stops = mockStops
}: StopProps & { mapCenter?: [number, number] }) => {
  return (
    <StopsOverlay
      highlightedStop={highlightedStop}
      highlightedStopColor="#0000ff"
      minZoom={minZoom}
      setLocation={setLocation}
      setViewedStop={setViewedStop}
      stops={stops}
      visible
    />
  );
};

export default {
  component: StopsOverlay,
  decorators: [withMap(center)],
  parameters: { storyshots: { disable: true } },
  title: "StopsOverlay"
};

export const Default = () => <Example />;
export const NoMinZoom = () => (
  <>
    <span style={{ position: "relative", zIndex: 1000 }}>
      With MapLibreGL, strong performance can be achieved without needing to
      rely on minZoom
    </span>
    <Example minZoom={null} />
  </>
);

// TODO: Re-add, and add support for old story
// export const WithCustomMarkers = () => <Example symbols={customSymbols} />;

export const FlexStops = () => (
  <Example
    filterStops={false}
    // @ts-expect-error json import acts strange with typescript
    stops={mockFlexStops}
  />
);

FlexStops.decorators = [withMap([33.85, -84.61], 10)];
