import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import GeneralSettingsPanel from ".";

export default {
  title: "GeneralSettingsPanel",
  component: "GeneralSettingsPanel",
  decorators: [withInfo],
  parameters: {
    info: {
      text: `The panel fo other (general) query parameters.`
    }
  }
};

const onQueryParamChange = action("onQueryParamChange");

// const queryParams = ["maxBikeDistance", "optimize", "maxWalkTime", "walkSpeed"];
const queryWalkAndTransit = {
  mode: "WALK,BUS,TRAM,SUBWAY",
  routingType: "ITINERARY"
};

export const walkAndTransit = () => (
  <GeneralSettingsPanel
    query={queryWalkAndTransit}
    onQueryParamChange={onQueryParamChange}
  />
);

const queryBikeAndTransit = {
  mode: "BICYCLE,BUS,TRAM,SUBWAY",
  routingType: "ITINERARY"
};

export const bikeAndTransit = () => (
  <GeneralSettingsPanel
    query={queryBikeAndTransit}
    onQueryParamChange={onQueryParamChange}
  />
);

const queryBikeRentAndTransitFixedOptimize = {
  mode: "BICYCLE_RENT,BUS,TRAM,SUBWAY",
  routingType: "ITINERARY",
  optimizeBike: "QUICK"
};

export const bikeRentAndTransitFixedOptimizeSpeed = () => (
  <GeneralSettingsPanel
    query={queryBikeRentAndTransitFixedOptimize}
    onQueryParamChange={onQueryParamChange}
  />
);

const queryMicromobilityRentAndTransit = {
  mode: "MICROMOBILITY_RENT,BUS,TRAM,SUBWAY",
  routingType: "ITINERARY"
};

export const micromobilityRentAndTransit = () => (
  <GeneralSettingsPanel
    query={queryMicromobilityRentAndTransit}
    onQueryParamChange={onQueryParamChange}
  />
);

const queryCarHailAndTransit = {
  mode: "CAR_HAIL,BUS,TRAM,SUBWAY",
  routingType: "ITINERARY"
};

export const carHailAndTransit = () => (
  <GeneralSettingsPanel
    query={queryCarHailAndTransit}
    onQueryParamChange={onQueryParamChange}
  />
);

const queryCarParkAndTransit = {
  mode: "CAR_PARK,BUS,TRAM,SUBWAY",
  routingType: "ITINERARY"
};

export const carParkAndTransit = () => (
  <GeneralSettingsPanel
    query={queryCarParkAndTransit}
    onQueryParamChange={onQueryParamChange}
  />
);

const queryWalkOnly = {
  mode: "WALK",
  routingType: "ITINERARY"
};

export const walkOnly = () => (
  <GeneralSettingsPanel
    query={queryWalkOnly}
    onQueryParamChange={onQueryParamChange}
  />
);

const queryBikeOnly = {
  mode: "BICYCLE",
  routingType: "ITINERARY"
};

export const bikeOnly = () => (
  <GeneralSettingsPanel
    query={queryBikeOnly}
    onQueryParamChange={onQueryParamChange}
  />
);
