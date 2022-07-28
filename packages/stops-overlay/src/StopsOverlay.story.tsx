import React from "react";
import { action } from "@storybook/addon-actions";

import StopsOverlay, { StopProps } from ".";
import mockStops from "../__mocks__/stops.json";
import mockFlexStops from "../__mocks__/flex-stops.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

const center: [number, number] = [45.523092, -122.671202];

const Example = ({
  stops = mockStops,
  setLocation = action("setLocation"),
  setViewedStop = action("setViewedStop"),
  minZoom = 15
}: StopProps & { mapCenter?: [number, number] }) => {
  return (
    <StopsOverlay
      minZoom={minZoom}
      setLocation={setLocation}
      setViewedStop={setViewedStop}
      stops={stops}
      visible
    />
  );
};

export default {
  title: "StopsOverlay",
  component: StopsOverlay,
  decorators: [withMap(center)]
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
