import BaseMap from "@opentripplanner/base-map";
import React from "react";

import tripData from "../__mocks__/mock-trip.json";
import TripViewerOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.518092, -122.671202];
const zoom = 13;

export default {
  title: "TripViewerOverlay",
  component: TripViewerOverlay
};

export const Default = () => (
  <BaseMap center={center} zoom={zoom}>
    <TripViewerOverlay tripData={tripData} visible />
  </BaseMap>
);

export const WithPathStyling = () => (
  <BaseMap center={center} zoom={zoom}>
    <TripViewerOverlay
      leafletPath={{
        color: "#000",
        dashArray: "2 3 5 7 11",
        opacity: 0.2,
        weight: 5
      }}
      tripData={tripData}
      visible
    />
  </BaseMap>
);
