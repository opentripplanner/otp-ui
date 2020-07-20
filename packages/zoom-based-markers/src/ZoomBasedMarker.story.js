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
import { CircleMarker, Marker } from "react-leaflet";
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

const Circle1 = ({ entity, zoom }) => (
  <CircleMarker center={[entity.lat, entity.lon]} radius={zoom < 7 ? 10 : 20} />
);

Circle1.propTypes = {
  entity: stopLayerStopType.isRequired,
  zoom: PropTypes.number.isRequired
};

const Circle2 = ({ entity }) => (
  <CircleMarker
    center={[entity.lat, entity.lon]}
    fillColor="#00FF00"
    radius={30}
  />
);

Circle2.propTypes = {
  entity: stopLayerStopType.isRequired
};

const Circle3 = ({ entity }) => (
  <CircleMarker
    center={[entity.lat, entity.lon]}
    fillColor="#FF0000"
    radius={30}
  />
);

Circle3.propTypes = {
  entity: stopLayerStopType.isRequired
};

const BusMarker = ({ entity }) => {
  const iconHtml = ReactDOMServer.renderToStaticMarkup(<Bus />);
  return (
    <Marker
      icon={divIcon({ html: iconHtml, className: "" })}
      position={[entity.lat, entity.lon]}
    />
  );
};

BusMarker.propTypes = {
  entity: stopLayerStopType.isRequired
};

const StreetcarMarker = ({ entity }) => {
  const iconHtml = ReactDOMServer.renderToStaticMarkup(<Streetcar />);
  return (
    <Marker
      icon={divIcon({ html: iconHtml, className: "" })}
      position={[entity.lat, entity.lon]}
    />
  );
};

StreetcarMarker.propTypes = {
  entity: stopLayerStopType.isRequired
};

const onViewportChanged = action("onViewportChanged");

const mySymbols = [
  {
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
    symbolByMode: {
      streetcar: StreetcarMarker
    }
  }
];

const mySymbolsWithGap = [
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
    const { symbols } = this.props;
    const { zoom } = this.state;
    return (
      <BaseMap
        center={mapCenter}
        onViewportChanged={this.handleViewportChanged}
        zoom={zoom}
      >
        <ZoomBasedMarkers entities={mockStops} symbols={symbols} zoom={zoom} />
      </BaseMap>
    );
  }
}

Example.propTypes = {
  symbols: PropTypes.arrayOf(zoomBasedSymbolType.isRequired).isRequired
};

storiesOf("ZoomBasedMarkers", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ZoomBasedMarkers with symbols for different zoom levels", () => (
    <Example symbols={mySymbols} />
  ))
  .add("ZoomBasedMarkers with no symbols for zooms 0-12", () => (
    <Example symbols={mySymbolsWithGap} />
  ));
