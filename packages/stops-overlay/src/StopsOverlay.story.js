import { divIcon } from "leaflet";
import BaseMap from "@opentripplanner/base-map";
import { stopLayerStopType } from "@opentripplanner/core-utils/src/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";
import { Bus, Subway } from "styled-icons/fa-solid";

import StopsOverlay from ".";
import mockStops from "../__mocks__/stops.json";
import DefaultStopMarker from "./stop-marker";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.523092, -122.671202];
const languageConfig = { stopViewer: "View Stop" };

function ExampleMarker({ stop }) {
  return (
    <DefaultStopMarker
      languageConfig={languageConfig}
      setLocation={action("setLocation")}
      setViewedStop={action("setViewedStop")}
      stop={stop}
    />
  );
}

ExampleMarker.propTypes = {
  stop: stopLayerStopType.isRequired
};

class Example extends Component {
  constructor() {
    super();
    this.state = {
      stops: []
    };
  }

  refreshStops = bounds => {
    const stops = mockStops.filter(
      stop =>
        stop.lat < bounds.maxLat &&
        stop.lat > bounds.minLat &&
        stop.lon < bounds.maxLon &&
        stop.lon > bounds.minLon
    );
    this.setState({ stops });
  };

  render() {
    const { StopMarker } = this.props;
    const { stops } = this.state;
    return (
      <BaseMap center={center}>
        <StopsOverlay
          name="Transit Stops"
          refreshStops={this.refreshStops}
          StopMarker={StopMarker}
          stops={stops}
          visible
        />
      </BaseMap>
    );
  }
}

Example.propTypes = {
  StopMarker: PropTypes.elementType
};

Example.defaultProps = {
  StopMarker: ExampleMarker
};

function CustomMarker({ stop }) {
  const iconHtml = ReactDOMServer.renderToStaticMarkup(
    stop.name.indexOf("MAX") > -1 ? <Subway /> : <Bus color="grey" />
  );
  return (
    <Marker
      icon={divIcon({ html: iconHtml, className: "" })}
      position={[stop.lat, stop.lon]}
    />
  );
}

CustomMarker.propTypes = {
  stop: stopLayerStopType.isRequired
};

storiesOf("StopsOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("StopsOverlay with default marker", () => <Example />)
  .add("StopsOverlay with custom marker", () => (
    <Example StopMarker={CustomMarker} />
  ));
