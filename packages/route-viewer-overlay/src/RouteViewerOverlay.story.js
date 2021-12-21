import BaseMap from "@opentripplanner/base-map";
import React from "react";

import routeData from "../__mocks__/mock-route.json";
import flexRouteData from "../__mocks__/mock-flex-route.json";
import RouteViewerOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const PORTLAND = [45.543092, -122.671202];
const POWDER_SPRINGS = [33.8595, -84.67483];
const zoom = 11;

export default {
  title: "RouteViewerOverlay",
  component: RouteViewerOverlay
};

export const Default = () => (
  <BaseMap center={PORTLAND} zoom={zoom}>
    <RouteViewerOverlay routeData={routeData} visible />
  </BaseMap>
);

export const WithPathStyling = () => (
  <BaseMap center={PORTLAND} zoom={zoom}>
    <RouteViewerOverlay
      clipToPatternStops
      path={{
        opacity: 0.5,
        weight: 10
      }}
      routeData={routeData}
      visible
    />
  </BaseMap>
);

export const FlexRoute = () => (
  <BaseMap center={POWDER_SPRINGS} zoom={zoom}>
    <RouteViewerOverlay routeData={flexRouteData} visible clipToPatternStops />
  </BaseMap>
);
