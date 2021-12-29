/* eslint-disable react/jsx-props-no-spreading */
import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { GeoJSON } from "react-leaflet";

import routeData from "../__mocks__/mock-route.json";
import flexRouteData from "../__mocks__/mock-flex-route.json";
import RouteViewerOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const PORTLAND = [45.543092, -122.671202];
const POWDER_SPRINGS = [33.8595, -84.67483];
const zoom = 11;

// Hide some story args completely.
const hiddenProp = {
  table: { disable: true }
};

export default {
  title: "RouteViewerOverlay",
  component: RouteViewerOverlay,
  argTypes: {
    center: hiddenProp,
    zoom: hiddenProp,
    routeData: hiddenProp,
    path: hiddenProp,
    extraLayer: hiddenProp
  }
};

/* Unfortunately, args within an object can't be controlled via storybook controls.
To be able to control the ClipToPatternStops arg via a control, the prop needs to be at 
the root of the args object. This means that all props for both the BaseMap and the
RouteViewerOverlay must be in the same args object. Luckily, there is no prop overlap
and this is safely possible */
const Template = args => (
  <BaseMap {...args}>
    <RouteViewerOverlay {...args} />
    {args.extraLayer}
  </BaseMap>
);

export const Default = Template.bind({});
Default.args = {
  center: PORTLAND,
  zoom,
  routeData
};

export const WithPathStyling = Template.bind({});
WithPathStyling.args = {
  center: PORTLAND,
  zoom,
  path: {
    opacity: 0.5,
    weight: 10
  },
  routeData
};

export const FlexRoute = Template.bind({});
FlexRoute.args = {
  center: POWDER_SPRINGS,
  zoom,
  routeData: flexRouteData,
  clipToPatternStops: true,
  // Since the data is fixed, we know that stops[1] will contain the relevant flex zone.
  // Using the stopsOverlay is not possible as it is very complex to implement */}
  extraLayer: <GeoJSON data={flexRouteData.stops[1].geometries.geoJson} />
};

FlexRoute.argTypes = {
  clipToPatternStops: { control: "boolean" }
};
