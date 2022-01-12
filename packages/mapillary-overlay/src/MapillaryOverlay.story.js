import BaseMap from "@opentripplanner/base-map";
import React from "react";

import MapillaryOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [55.599748649891, 12.997537150008];
const zoom = 13;

export default {
  title: "MapillaryOverlay",
  component: MapillaryOverlay
};

export const Default = () => (
  <BaseMap center={center} zoom={zoom}>
    <MapillaryOverlay />
  </BaseMap>
);
