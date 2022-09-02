// Removed as these stories were built for Leaflet. It isn't worth fully updating them
// as this layer is not really needed anymore with MapLibreGL and should be removed soon.
/* eslint-disable react/forbid-prop-types */
// eslint-disable-next-line max-classes-per-file
import BaseMap, {
  Styled as BaseMapStyles,
  MarkerWithPopup
} from "@opentripplanner/base-map";
import { Bus, Streetcar } from "@opentripplanner/icons";
import {
  LayerEntity,
  Stop,
  SymbolComponent,
  SymbolComponentBaseProps,
  ZoomBasedSymbol
} from "@opentripplanner/types";
import { action } from "@storybook/addon-actions";
import React, { useState } from "react";

import ZoomBasedMarkers from ".";

const mockStops = [
  {
    id: "3",
    name: "A Ave & Second St Streetcar",
    lat: 45.419388,
    lon: -122.665197
  },
  { id: "6", name: "A Ave & 8th St Bus", lat: 45.420217, lon: -122.67307 },
  { id: "7", name: "A Ave & 8th St Bus", lat: 45.420411, lon: -122.67268 }
];

const mapCenter: [number, number] = [45.420217, -122.67307];
const onViewportChanged = action("onViewportChanged");

// Common prop types for the components used to render examples.
// Some of the example components below have a children prop,
// which is not required, unless you plan to inject children.

type MarkerProps = {
  /** The children of the component. */
  children?: React.ReactNode;
  /** The stop to render. */
  entity: Stop;
};
const Circle: SymbolComponent = ({ children, entity }: MarkerProps) => (
  <MarkerWithPopup position={[entity.lat, entity.lon]} popupContents={children}>
    <BaseMapStyles.LeafletStyleMarker color="#00FF00" size={15} />
  </MarkerWithPopup>
);

// Generates markers from icons.
const IconMarker: SymbolComponent = (
  Icon: React.FunctionComponent<{ width: number }>
) => {
  const GeneratedMarker = ({ children, entity }: MarkerProps) => {
    return (
      <MarkerWithPopup
        popupContents={children}
        position={[entity.lat, entity.lon]}
      >
        <Icon width={20} />
      </MarkerWithPopup>
    );
  };

  return GeneratedMarker;
};

// Symbol definition passed to the ZoomBasedMarkers component.
const mySymbols: ZoomBasedSymbol[] = [
  // Omit the zoom levels 0-9,
  // so no symbol will be drawn for these zoom levels.
  {
    // Most basic example:
    // This renders all entities with the same symbol for zooms 10-13.
    minZoom: 10,
    symbol: Circle
  },
  {
    // Example with symbols for some entity types:
    // The entity with id 'streetcar' is rendered using a Streetcar marker,
    // and the other ones are rendered using a Bus Marker.
    // Use symbolByType to define symbols shown for some entity types returned by the getType function.
    // If a value returned from getType is not listed here,
    // then the component defined in 'symbol' will be rendered by default.
    getType: (entity: LayerEntity) => (entity.id === "3" ? "streetcar" : "bus"),
    minZoom: 14,
    symbol: IconMarker(Bus),
    symbolByType: {
      streetcar: IconMarker(Streetcar)
    }
  }
];

// Pass a function to ZoomBasedMarkers symbolTransform prop
// to inject child components or wrap Symbol within other components.
// Here, we inject a sample popup to the components defined in the symbols props.
// Note: to inject children to a symbol, the symbol must explicitly render any applicable children.
const exampleTransform = (Symbol: SymbolComponent): SymbolComponent => {
  const InnerSymbol = ({ entity, zoom }: SymbolComponentBaseProps) => (
    <Symbol entity={entity} zoom={zoom}>
      {/* eslint-disable-next-line react/prop-types */}
      <h3>{entity.name}</h3>
      This is a popup from symbolTransform
    </Symbol>
  );
  return InnerSymbol;
};

// Example container with a ZoomBasedMarkers component inside a BaseMap.
type ExampleProps = {
  symbols: ZoomBasedSymbol[];
  symbolTransform?: (symbol: SymbolComponent) => SymbolComponent;
};
const Example = (props: ExampleProps) => {
  const [zoom, setZoom] = useState(12);

  const handleViewportChanged = e => {
    onViewportChanged(e);
    setZoom(e.zoom);
  };

  const { symbols, symbolTransform } = props;
  // We can't use a decorator here because we need to supply a prop to BaseMap
  return (
    <BaseMapStyles.StoryMapContainer>
      <BaseMap
        center={mapCenter}
        onViewportChanged={handleViewportChanged}
        zoom={zoom}
      >
        <ZoomBasedMarkers
          entities={mockStops}
          symbols={symbols}
          symbolTransform={symbolTransform}
          zoom={zoom}
        />
      </BaseMap>
    </BaseMapStyles.StoryMapContainer>
  );
};

export default {
  title: "ZoomBasedMarkers",
  component: ZoomBasedMarkers
};

export const SymbolsForDifferentZoomLevels = () => (
  <Example symbols={mySymbols} />
);

export const TransformedSymbols = () => (
  <Example symbols={mySymbols} symbolTransform={exampleTransform} />
);
