import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { Source, Layer } from "react-map-gl";

import routeData from "../__mocks__/mock-route.json";
import flexRouteData from "../__mocks__/mock-flex-route.json";
import RouteViewerOverlay from ".";

import "maplibre-gl/dist/maplibre-gl.css";

const PORTLAND = [45.543092, -122.671202];
const POWDER_SPRINGS = [33.8595, -84.67483];
const zoom = 11;

// Hide some story args completely.
const hiddenProp = {
  table: { disable: true }
};

export default {
  argTypes: {
    center: hiddenProp,
    extraLayer: hiddenProp,
    path: hiddenProp,
    routeData: hiddenProp,
    zoom: hiddenProp
  },
  component: RouteViewerOverlay,
  title: "RouteViewerOverlay"
};

const Template = args => (
  <BaseMap center={args.center} zoom={args.zoom}>
    <RouteViewerOverlay
      clipToPatternStops={args.clipToPatternStops}
      path={args.path}
      routeData={args.routeData}
    />
    {args.extraLayer}
  </BaseMap>
);

export const Default = Template.bind({});
Default.args = {
  center: PORTLAND,
  routeData,
  zoom
};

export const WithPathStyling = Template.bind({});
WithPathStyling.args = {
  center: PORTLAND,
  path: {
    opacity: 0.5,
    weight: 10
  },
  routeData,
  zoom
};

export const FlexRoute = Template.bind({});
FlexRoute.args = {
  center: POWDER_SPRINGS,
  clipToPatternStops: true,
  // Since the data is fixed, we know that stops[1] will contain the relevant flex zone.
  // Using the stopsOverlay is not possible as it is very complex to implement */}
  extraLayer: (
    <Source
      id="extra"
      type="geojson"
      data={flexRouteData.stops[1].geometries.geoJson}
    >
      <Layer id="extra" type="fill" paint={{ "fill-opacity": 0.2 }} />
    </Source>
  ),
  routeData: flexRouteData,
  zoom
};

FlexRoute.argTypes = {
  clipToPatternStops: { control: "boolean" }
};
