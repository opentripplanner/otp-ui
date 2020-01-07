import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import routeData from "../__mocks__/mock-route.json";
import RouteViewerOverlay from ".";

import "@opentripplanner/base-map/assets/map.css";

const center = [45.543092, -122.671202];
const zoom = 11;

storiesOf("RouteViewerOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("RouteViewerOverlay", () => (
    <BaseMap center={center} zoom={zoom}>
      <RouteViewerOverlay routeData={routeData} visible />
    </BaseMap>
  ))
  .add("RouteViewerOverlay with path styling", () => (
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
  ));
