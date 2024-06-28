import React, { useEffect, useState } from "react";

import routeData from "../__mocks__/mock-route.json";
import routeData2 from "../__mocks__/mock-route2.json";
import routeDataOtp2 from "../__mocks__/mock-route-otp2.json";
import flexRouteData from "../__mocks__/mock-flex-route.json";
import flexRouteData2 from "../__mocks__/mock-flex-route2.json";
import flexRouteData3 from "../__mocks__/mock-flex-route3.json";

import StopsOverlay from "../../stops-overlay/src";
import { withMap } from "../../../.storybook/base-map-wrapper";
import RouteViewerOverlay from ".";

const PORTLAND = [45.543092, -122.671202];
const POWDER_SPRINGS = [33.8595, -84.67483];
const zoom = 11;
const disableStoryshots = { storyshots: { disable: true } };

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
  parameters: disableStoryshots,
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

/** Should zoom to pattern. */

const WithChangingRoute = () => {
  const [rtData, setRouteData] = useState(routeData);

  useEffect(() => {
    const interval = setInterval(() => {
      setRouteData(rtData === routeData2 ? routeData : routeData2);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [rtData]);

  return <RouteViewerOverlay routeData={rtData} />;
};

export const Default = Template.bind({});
Default.args = {
  routeData
};
Default.parameters = disableStoryshots;

export const WithPathStyling = Template.bind({});
WithPathStyling.args = {
  path: {
    opacity: 0.5,
    weight: 10
  },
  routeData
};
WithPathStyling.parameters = disableStoryshots;

export const OTP2RouteOutsideOfInitialView = Template.bind({});
OTP2RouteOutsideOfInitialView.args = {
  routeData: routeDataOtp2
};
OTP2RouteOutsideOfInitialView.parameters = disableStoryshots;

export const WithChangingPath = (): JSX.Element => <WithChangingRoute />;
WithChangingPath.parameters = disableStoryshots;

export const FlexRoute = Template.bind({});
FlexRoute.args = {
  clipToPatternStops: true,
  // Since the data is fixed, we know where the relevant flex zone is.
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
FlexRoute.parameters = disableStoryshots;

export const FlexRoute2 = Template.bind({});
FlexRoute2.args = {
  clipToPatternStops: true,
  // Since the data is fixed, we know where the relevant flex zone is.
  // Using the stopsOverlay is not possible as it is very complex to implement */}
  extraLayer: (
    <StopsOverlay
      stops={Object.values(flexRouteData2.patterns)[0]
        .stops.filter(stop => stop?.geometries?.geoJson?.type === "Polygon")
        .map(stop => ({ ...stop, color: `#${flexRouteData2.color}` }))}
      symbols={[]}
      visible
    />
  ),
  routeData: flexRouteData2
};

FlexRoute2.argTypes = {
  clipToPatternStops: { control: "boolean" }
};
FlexRoute2.decorators = [withMap(POWDER_SPRINGS, zoom)];
FlexRoute2.parameters = disableStoryshots;

export const FlexRoute3 = Template.bind({});
FlexRoute3.args = {
  extraLayer: (
    <StopsOverlay
      // Tests stop area with GeometryCollection
      stops={Object.values(flexRouteData3.patterns)[2]
        .stops.filter(
          stop =>
            stop?.geometries?.geoJson?.type === "Polygon" ||
            stop?.geometries?.geoJson?.type === "GeometryCollection"
        )
        .map(stop => ({ ...stop, color: `#333` }))}
      symbols={[]}
      visible
    />
  ),
  routeData: flexRouteData3
};
FlexRoute3.parameters = disableStoryshots;
