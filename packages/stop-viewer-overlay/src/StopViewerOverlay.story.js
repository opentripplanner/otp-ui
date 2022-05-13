// TODO: remove when typescripting
/* eslint-disable react/forbid-prop-types */

import BaseMap from "@opentripplanner/base-map";
import React from "react";
import PropTypes from "prop-types";
import { CircleMarker } from "react-leaflet";

import DefaultStopMarker from "./default-stop-marker";
import StopViewerOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.518092, -122.671202];
const zoom = 13;

const fakeStop = {
  id: "stop-id",
  lat: 45.518,
  lon: -122.671,
  name: "Fake Stop"
};

function CustomMarker({ stop }) {
  return <CircleMarker center={[stop.lat, stop.lon]} key={stop.id} />;
}

CustomMarker.propTypes = {
  // Typescript TODO: restore correct type ?
  // stop: coreUtils.types.stopLayerStopType.isRequired
  stop: PropTypes.object.isRequired
};

export default {
  title: "StopViewerOverlay",
  component: StopViewerOverlay
};

export const Default = () => (
  <BaseMap center={center} zoom={zoom}>
    <StopViewerOverlay stop={fakeStop} StopMarker={DefaultStopMarker} visible />
  </BaseMap>
);

export const WithCustomMarker = () => (
  <BaseMap center={center} zoom={zoom}>
    <StopViewerOverlay stop={fakeStop} StopMarker={CustomMarker} visible />
  </BaseMap>
);
