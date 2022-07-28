import React from "react";

import routeData from "../__mocks__/mock-route.json";
import flexRouteData from "../__mocks__/mock-flex-route.json";
import RouteViewerOverlay from ".";

import StopsOverlay from "../../stops-overlay/src";
import { withMap } from "../../../.storybook/base-map-wrapper";

const PORTLAND = [45.543092, -122.671202];
const POWDER_SPRINGS = [33.8595, -84.67483];
const zoom = 11;

// Hide some story args completely.
const hiddenProp = {
  table: { disable: true }
};

export default {
  argTypes: {
    extraLayer: hiddenProp,
    path: hiddenProp,
    routeData: hiddenProp
  },
  component: RouteViewerOverlay,
  decorators: [withMap(PORTLAND, zoom)],
  title: "RouteViewerOverlay"
};

const Template = args => (
  <>
    <RouteViewerOverlay
      clipToPatternStops={args.clipToPatternStops}
      path={args.path}
      routeData={args.routeData}
    />
    {args.extraLayer}
  </>
);

export const Default = Template.bind({});
Default.args = {
  routeData
};

export const WithPathStyling = Template.bind({});
WithPathStyling.args = {
  path: {
    opacity: 0.5,
    weight: 10
  },
  routeData
};

export const FlexRoute = Template.bind({});
FlexRoute.args = {
  clipToPatternStops: true,
  // Since the data is fixed, we know that stops[1] will contain the relevant flex zone.
  // Using the stopsOverlay is not possible as it is very complex to implement */}
  extraLayer: (
    <StopsOverlay
      stops={flexRouteData.patterns[0].stops
        .filter(stop => stop?.geometries?.geoJson?.type === "Polygon")
        .map(stop => ({ ...stop, color: `#${flexRouteData.color}` }))}
      symbols={[]}
      visible
    />
  ),
  routeData: flexRouteData
};

FlexRoute.argTypes = {
  clipToPatternStops: { control: "boolean" }
};
FlexRoute.decorators = [withMap(POWDER_SPRINGS, zoom)];
