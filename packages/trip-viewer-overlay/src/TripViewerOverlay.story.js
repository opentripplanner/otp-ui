import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import tripData from "../__mocks__/mock-trip.json";
import TripViewerOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.518092, -122.671202];
const zoom = 13;

storiesOf("TripViewerOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("TripViewerOverlay", () => (
    <BaseMap center={center} zoom={zoom}>
      <TripViewerOverlay tripData={tripData} visible />
    </BaseMap>
  ))
  .add("TripViewerOverlay with path styling", () => (
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
  ));
