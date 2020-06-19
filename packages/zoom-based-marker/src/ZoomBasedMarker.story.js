// eslint-disable-next-line max-classes-per-file
import { divIcon } from "leaflet";
import BaseMap from "@opentripplanner/base-map";
import { zoomBasedMarkerType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import { CircleMarker, Marker } from "react-leaflet";
import { withA11y } from "@storybook/addon-a11y";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";
import { Subway } from "styled-icons/fa-solid";

import ZoomBasedMarker from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const mapCenter = [45.523092, -122.671202];

const Circle1 = ({ center }) => <CircleMarker center={center} radius={10} />;

Circle1.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
};

const Circle2 = ({ center }) => (
  <CircleMarker center={center} fillColor="#00FF00" radius={30} />
);

Circle2.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
};

const CustomMarker = ({ center }) => {
  const iconHtml = ReactDOMServer.renderToStaticMarkup(<Subway />);
  return (
    <Marker
      icon={divIcon({ html: iconHtml, className: "" })}
      position={center}
    />
  );
};

CustomMarker.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
};

const onViewportChanged = action("onViewportChanged");

const myMarkers = [
  {
    marker: Circle1,
    minZoom: 0
  },
  {
    marker: Circle2,
    minZoom: 12
  },
  {
    marker: CustomMarker,
    minZoom: 16
  }
];

const myMarkersWithGap = [
  {
    marker: Circle2,
    minZoom: 12
  },
  {
    marker: CustomMarker,
    minZoom: 16
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
    const { markers } = this.props;
    const { zoom } = this.state;
    return (
      <BaseMap
        center={mapCenter}
        onViewportChanged={this.handleViewportChanged}
        zoom={zoom}
      >
        <ZoomBasedMarker center={mapCenter} markers={markers} zoom={zoom} />
      </BaseMap>
    );
  }
}

Example.propTypes = {
  markers: PropTypes.arrayOf(zoomBasedMarkerType.isRequired).isRequired
};

storiesOf("ZoomBasedMarker", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ZoomBasedMarker with markers for different zoom levels", () => (
    <Example markers={myMarkers} />
  ))
  .add("ZoomBasedMarker with marker gap", () => (
    <Example markers={myMarkersWithGap} />
  ));
