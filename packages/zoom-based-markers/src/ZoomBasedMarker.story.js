// Removed as core-utils is typescripted. TODO: Remove when typescripting!
/* eslint-disable react/forbid-prop-types */
// eslint-disable-next-line max-classes-per-file
import { divIcon } from "leaflet";
import BaseMap from "@opentripplanner/base-map";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import { CircleMarker, Marker, Popup } from "react-leaflet";
import { action } from "@storybook/addon-actions";
import { Bus, Streetcar } from "@opentripplanner/icons";

import ZoomBasedMarkers from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

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

const mapCenter = [45.420217, -122.67307];
const onViewportChanged = action("onViewportChanged");

// Common prop types for the components used to render examples.
// Some of the example components below have a children prop,
// which is not required, unless you plan to inject children.
const propTypes = {
  /** The children of the component. */
  children: PropTypes.node,
  /** The stop to render. */
  // entity: coreUtils.types.stopLayerStopType.isRequired
  entity: PropTypes.object.isRequired
};
const defaultProps = {
  children: null
};

const Circle = ({ children, entity }) => (
  <CircleMarker
    center={[entity.lat, entity.lon]}
    fillColor="#00FF00"
    radius={30}
  >
    {children}
  </CircleMarker>
);
Circle.propTypes = propTypes;
Circle.defaultProps = defaultProps;

// Generates markers from icons.
const IconMarker = Icon => {
  const GeneratedMarker = ({ children, entity }) => {
    const iconHtml = ReactDOMServer.renderToStaticMarkup(<Icon />);
    return (
      <Marker
        icon={divIcon({ html: iconHtml, className: "" })}
        position={[entity.lat, entity.lon]}
      >
        {children}
      </Marker>
    );
  };
  GeneratedMarker.propTypes = propTypes;
  GeneratedMarker.defaultProps = defaultProps;

  return GeneratedMarker;
};

// Symbol definition passed to the ZoomBasedMarkers component.
const mySymbols = [
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
    getType: entity => (entity.id === "3" ? "streetcar" : "bus"),
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
const exampleTransform = Symbol => {
  const InnerSymbol = ({ entity, zoom }) => (
    <Symbol entity={entity} zoom={zoom}>
      <Popup>
        {/* eslint-disable-next-line react/prop-types */}
        <h3>{entity.name}</h3>
        This is a popup from symbolTransform
      </Popup>
    </Symbol>
  );
  InnerSymbol.propTypes = {
    // entity: coreUtils.types.stopLayerStopType.isRequired,
    entity: PropTypes.object.isRequired,
    zoom: PropTypes.number.isRequired
  };

  return InnerSymbol;
};

// Example container with a ZoomBasedMarkers component inside a BaseMap.
class Example extends Component {
  constructor() {
    super();

    this.state = {
      zoom: 10
    };
  }

  handleViewportChanged = e => {
    onViewportChanged(e);
    this.setState({ zoom: e.zoom });
  };

  render() {
    const { symbols, symbolTransform } = this.props;
    const { zoom } = this.state;
    return (
      <BaseMap
        center={mapCenter}
        onViewportChanged={this.handleViewportChanged}
        zoom={zoom}
      >
        <ZoomBasedMarkers
          entities={mockStops}
          symbols={symbols}
          symbolTransform={symbolTransform}
          zoom={zoom}
        />
      </BaseMap>
    );
  }
}

Example.propTypes = {
  // symbols: PropTypes.arrayOf(coreUtils.types.zoomBasedSymbolType.isRequired)
  //   .isRequired,
  symbols: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  symbolTransform: PropTypes.func
};
Example.defaultProps = {
  symbolTransform: null
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
