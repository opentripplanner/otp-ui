import BaseMap from "@opentripplanner/base-map";

import React from "react";
import { action } from "@storybook/addon-actions";

import StopsOverlay, { StopProps } from ".";
import mockStops from "../__mocks__/stops.json";
import mockFlexStops from "../__mocks__/flex-stops.json";

import "maplibre-gl/dist/maplibre-gl.css";

const center: [number, number] = [45.523092, -122.671202];

const Example = ({
  stops = mockStops,
  mapCenter = center,
  setLocation = action("setLocation"),
  setViewedStop = action("setViewedStop"),
  minZoom = 15
}: StopProps & { mapCenter?: [number, number] }) => {
  return (
    <BaseMap center={mapCenter}>
      <StopsOverlay
        minZoom={minZoom}
        setLocation={setLocation}
        setViewedStop={setViewedStop}
        stops={stops}
        visible
      />
    </BaseMap>
  );
};

export default {
  title: "StopsOverlay",
  component: StopsOverlay
};

export const Default = () => <Example />;
export const NoMinZoom = () => (
  <>
    With MapLibreGL, strong performance can be achieved without needing to rely
    on minZoom
    <Example minZoom={null} />
  </>
);

// TODO: Re-add, and add support for old story
// export const WithCustomMarkers = () => <Example symbols={customSymbols} />;

export const FlexStops = () => (
  <Example
    filterStops={false}
    mapCenter={[33.85, -84.61]}
    // @ts-expect-error json import acts strange with typescript
    stops={mockFlexStops}
  />
);
