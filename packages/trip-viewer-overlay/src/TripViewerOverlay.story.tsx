import BaseMap, { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import React from "react";

import tripData from "../__mocks__/mock-trip.json";
import TripViewerOverlay from ".";

const center: [number, number] = [45.518092, -122.671202];
const zoom = 13;

export default {
  title: "TripViewerOverlay",
  component: TripViewerOverlay
};

export const Default = (): JSX.Element => (
  <BaseMapStyled.StoryMapContainer>
    <BaseMap center={center} zoom={zoom}>
      <TripViewerOverlay tripData={tripData} visible />
    </BaseMap>
  </BaseMapStyled.StoryMapContainer>
);

export const WithPathStyling = (): JSX.Element => (
  <BaseMapStyled.StoryMapContainer>
    <BaseMap center={center} zoom={zoom}>
      <TripViewerOverlay
        path={{
          color: "#000",
          opacity: 0.2,
          weight: 5
        }}
        tripData={tripData}
        visible
      />
    </BaseMap>
  </BaseMapStyled.StoryMapContainer>
);
