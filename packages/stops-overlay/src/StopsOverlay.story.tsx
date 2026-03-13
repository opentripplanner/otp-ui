/* eslint-disable react/display-name */
import React from "react";
import { action } from "storybook/actions";

import mockStops from "../__mocks__/stops.json";
import mockFlexStopsPolygon from "../__mocks__/flex-stops-polygon.json";
import mockFlexStopsMultiPolygon from "../__mocks__/flex-stops-multipolygon.json";
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

export const FlexStopsPolygon = {
  render: () => (
    <Example
      filterStops={false}
      // @ts-expect-error json import acts strange with typescript
      stops={mockFlexStopsPolygon}
    />
  ),

  decorators: [withMap([33.85, -84.61], 10)]
};

export const FlexStopsMultiPolygon = {
  render: () => {
    const mappedStops = mockFlexStopsMultiPolygon.map(s => ({
      ...s,
      color: `#${s.routes[0].color}`
    }));
    return (
      <Example
        filterStops={false}
        // @ts-expect-error json import acts strange with typescript
        stops={mappedStops}
      />
    );
  },
  decorators: [withMap([33.7629671, -84.4513974], 10)]
};
