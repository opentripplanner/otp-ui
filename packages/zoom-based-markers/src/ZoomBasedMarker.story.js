// eslint-disable-next-line max-classes-per-file
import { divIcon } from "leaflet";
import BaseMap from "@opentripplanner/base-map";
import {
  stopLayerStopType,
  zoomBasedSymbolType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import { CircleMarker, Marker, Popup } from "react-leaflet";
import { withA11y } from "@storybook/addon-a11y";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";
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

// Common prop types for the components used to render examples.
// Some of the example components below have a children prop,
// which is not required, unless you plan to inject children.

const propTypes = {
  /** The children of the component. */
  children: PropTypes.node,
  /** The stop to render. */
  entity: stopLayerStopType.isRequired
};
const defaultProps = {
  children: null
};

const Circle1 = ({ entity, zoom }) => (
  <CircleMarker center={[entity.lat, entity.lon]} radius={zoom < 7 ? 10 : 20} />
);
Circle1.propTypes = {
  entity: stopLayerStopType.isRequired,
  zoom: PropTypes.number.isRequired
};

const Circle2 = ({ children, entity }) => (
  <CircleMarker
    center={[entity.lat, entity.lon]}
    fillColor="#00FF00"
    radius={30}
  >
    {children}
  </CircleMarker>
);
Circle2.propTypes = propTypes;
Circle2.defaultProps = defaultProps;

const Circle3 = ({ children, entity }) => (
  <CircleMarker
    center={[entity.lat, entity.lon]}
    fillColor="#FF0000"
    radius={30}
  >
    {children}
  </CircleMarker>
);
Circle3.propTypes = propTypes;
Circle3.defaultProps = defaultProps;

const BusMarker = ({ children, entity }) => {
  const iconHtml = ReactDOMServer.renderToStaticMarkup(<Bus />);
  return (
    <Marker
      icon={divIcon({ html: iconHtml, className: "" })}
      position={[entity.lat, entity.lon]}
    >
      {children}
    </Marker>
  );
};
BusMarker.propTypes = propTypes;
BusMarker.defaultProps = defaultProps;

const StreetcarMarker = ({ children, entity }) => {
  const iconHtml = ReactDOMServer.renderToStaticMarkup(<Streetcar />);
  return (
    <Marker
      icon={divIcon({ html: iconHtml, className: "" })}
      position={[entity.lat, entity.lon]}
    >
      {children}
    </Marker>
  );
};
StreetcarMarker.propTypes = propTypes;
StreetcarMarker.defaultProps = defaultProps;

const onViewportChanged = action("onViewportChanged");

// Below are symbol definitions passed to the ZoomBasedMarkers component.

const mySymbols = [
  {
    // minZoom is necessary to define the zoom level from which.
    // the stated symbol will be displayed. The symbol is displayed
    // until a symbol with a higher minZoom is found.
    // Circle1 will be displayed from zoom levels 0 to 11,
    // because there is an entry that sets the symbol for zoom 12, 13.
    minZoom: 0,
    symbol: Circle1
  },
  {
    minZoom: 12,
    symbol: Circle2
  },
  {
    getMode: entity => (entity.id === "3" ? "streetcar" : "bus"),
    minZoom: 14,
    symbol: Circle2,
    symbolByMode: {
      streetcar: Circle3
    }
  },
  {
    getMode: entity => (entity.id === "3" ? "streetcar" : "bus"),
    minZoom: 16,
    symbol: BusMarker,
    // Use symbolByMode to define symbols shown for some modes returned by the getMode function.
    // If a value returned from getMode is not listed here,
    // then the component defined in 'symbol' will be rendered by default.
    // In this example, the entity with id 'streetcar' is rendered using StreetcarMarker,
    // and the other ones are rendered using BusMarker.
    symbolByMode: {
      streetcar: StreetcarMarker
    }
  }
];

const mySymbolsWithGap = [
  // In this example, we omit the zoom levels 0-11,
  // so no symbol will be drawn for these zoom levels.
  {
    minZoom: 12,
    symbol: Circle2
  },
  {
    getMode: entity => (entity.id === "3" ? "streetcar" : "bus"),
    minZoom: 14,
    symbol: BusMarker,
    symbolByMode: {
      streetcar: StreetcarMarker
    }
  }
];

// Pass a function to ZoomBasedMarkers symbolTransform prop
// to inject child components or wrap Symbol within other components.
// Here, we inject a sample popup to the components defined in the symbols props.
// Note: to inject children to a symbol, the symbol must explicity render any applicable children.
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
    /** The stop to render. */
    entity: stopLayerStopType.isRequired,
    /** The zoom level being rendered. */
    zoom: PropTypes.number
  };
  InnerSymbol.defaultProps = {
    zoom: null
  };

  return InnerSymbol;
};

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
  symbols: PropTypes.arrayOf(zoomBasedSymbolType.isRequired).isRequired,
  symbolTransform: PropTypes.func
};
Example.defaultProps = {
  symbolTransform: null
};

storiesOf("ZoomBasedMarkers", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ZoomBasedMarkers with symbols for different zoom levels", () => (
    <Example symbols={mySymbols} />
  ))
  .add("ZoomBasedMarkers with no symbols for zooms 0-12", () => (
    <Example symbols={mySymbolsWithGap} />
  ))
  .add("ZoomBasedMarkers with transformed symbols", () => (
    <Example symbols={mySymbols} symbolTransform={exampleTransform} />
  ));
