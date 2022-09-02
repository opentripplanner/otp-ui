import React from "react";

import tripData from "../__mocks__/mock-trip.json";
import TripViewerOverlay from ".";
import { withMap } from "../../../.storybook/base-map-wrapper";

const center: [number, number] = [45.518092, -122.671202];
const zoom = 12;

export default {
  title: "TripViewerOverlay",
  component: TripViewerOverlay,
  decorators: [withMap(center, zoom)]
};

export const Default = (): JSX.Element => (
  <TripViewerOverlay tripData={tripData} visible />
);

export const WithPathStyling = (): JSX.Element => (
  <TripViewerOverlay
    path={{
      color: "#000",
      opacity: 0.2,
      weight: 5
    }}
    tripData={tripData}
    visible
  />
);
