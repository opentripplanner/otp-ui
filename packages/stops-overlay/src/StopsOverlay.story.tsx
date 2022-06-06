import BaseMap from "@opentripplanner/base-map";

import React from "react";
import { action } from "@storybook/addon-actions";
import { Bus, Subway } from "styled-icons/fa-solid";

import { LayerEntity, Stop, ZoomBasedSymbol } from "@opentripplanner/types";
import { Marker } from "react-map-gl";
import StopsOverlay from ".";
import mockStops from "../__mocks__/stops.json";
import mockFlexStops from "../__mocks__/flex-stops.json";
import DefaultStopMarker from "./default-stop-marker";

import "maplibre-gl/dist/maplibre-gl.css";

const center: [number, number] = [45.523092, -122.671202];

function ExampleMarker({ entity: stop }: { entity: LayerEntity }) {
  return (
    <DefaultStopMarker
      setLocation={action("setLocation")}
      setViewedStop={action("setViewedStop")}
      stop={(stop as unknown) as Stop}
    />
  );
}
type ExampleProps = {
  stops?: Stop[];
  mapCenter?: [number, number];
  symbols?: ZoomBasedSymbol[];
};
const Example = ({
  stops = mockStops,
  mapCenter = center,
  symbols = [
    {
      minZoom: 15,
      symbol: ExampleMarker
    }
  ]
}: ExampleProps) => {
  return (
    <BaseMap center={mapCenter}>
      <StopsOverlay stops={stops} symbols={symbols} visible />
    </BaseMap>
  );
};

function makeCustomMarker(Icon) {
  const CustomMarker = ({ entity: stop }: { entity: LayerEntity }) => {
    return (
      <Marker latitude={stop.lat} longitude={stop.lon}>
        <Icon width={12} />
      </Marker>
    );
  };

  return CustomMarker;
}

const customSymbols = [
  {
    getType: stop => (stop.name.indexOf("MAX") > -1 ? "MAX" : "BUS"),
    minZoom: 14,
    symbol: makeCustomMarker(() => <Bus color="gray" width={12} />),
    symbolByType: {
      MAX: makeCustomMarker(Subway)
    }
  }
];

export default {
  title: "StopsOverlay",
  component: StopsOverlay
};

export const Default = () => <Example />;

export const WithCustomMarkers = () => <Example symbols={customSymbols} />;

export const FlexStops = () => (
  <Example
    filterStops={false}
    mapCenter={[33.85, -84.61]}
    stops={mockFlexStops}
    symbols={[
      {
        minZoom: 5,
        symbol: ExampleMarker
      }
    ]}
  />
);
