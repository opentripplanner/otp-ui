import BaseMap from "@opentripplanner/base-map";
import React, { useState } from "react";

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

// Storyshot can't render a story with hooks. Creating a function like this
// is the workaround. See https://github.com/storybookjs/storybook/issues/8177#issuecomment-599866282
const FlexRouteWithClipButton = () => {
  const [clip, setClip] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setClip(!clip)}>
        {clip ? "Unclip" : "Clip"} Route to Outside Flex Zone
      </button>
      <BaseMap center={POWDER_SPRINGS} zoom={zoom}>
        <RouteViewerOverlay
          clipToPatternStops={clip}
          routeData={flexRouteData}
          visible
        />
      </BaseMap>
    </>
  );
};

export const FlexRoute = () => <FlexRouteWithClipButton />;
