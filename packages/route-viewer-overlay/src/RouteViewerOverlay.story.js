import BaseMap from "@opentripplanner/base-map";
import React from "react";

import routeData from "../__mocks__/mock-route.json";
import RouteViewerOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.543092, -122.671202];
const zoom = 11;

export default {
  title: "RouteViewerOverlay",
  component: RouteViewerOverlay
};

export const Default = () => (
  <BaseMap center={center} zoom={zoom}>
    <RouteViewerOverlay routeData={routeData} visible />
  </BaseMap>
);

export const WithPathStyling = () => (
  <BaseMap center={center} zoom={zoom}>
    <RouteViewerOverlay
      path={{
        opacity: 0.5,
        weight: 10
      }}
      routeData={routeData}
      visible
    />
  </BaseMap>
);
