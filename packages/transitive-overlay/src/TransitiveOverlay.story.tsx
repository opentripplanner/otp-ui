/* eslint-disable react/jsx-props-no-spreading */
import EndpointsOverlay from "@opentripplanner/endpoints-overlay";
import React from "react";
import { action } from "@storybook/addon-actions";
import { injectIntl } from "react-intl";

import { withMap } from "../../../.storybook/base-map-wrapper";
import TransitiveOverlay, { itineraryToTransitive } from ".";

// import mock itinaries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-only.json");
const bikeRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental.json");
const bikeRentalTransitBikeRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental-transit-bike-rental.json");
const bikeTransitBikeItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-transit-bike.json");
const eScooterRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-rental.json");
const eScooterRentalTransiteScooterRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-transit-e-scooter.json");
const parkAndRideItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/park-and-ride.json");
const tncTransitTncItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json");
const walkInterlinedTransitItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-interlined-transit-walk.json");
const walkOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkItineraryNoIntermediateStops = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-no-intermediate-stops.json");
const walkTransitWalkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const flexItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/flex-itinerary.json");
const otp2ScooterItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2-scooter.json");

const companies = [
  {
    id: "RAZOR",
    label: "Razor",
    modes: "SCOOTER"
  },
  {
    id: "SHARED",
    label: "Shared",
    modes: "MICROMOBILITY_RENT"
  }
];

const setLocation = action("setLocation");

function getFromLocation(itinerary) {
  return itinerary.legs[0].from;
}

function getToLocation(itinerary) {
  return itinerary.legs[itinerary.legs.length - 1].to;
}

export default {
  title: "TransitiveOverlay",
  decorators: [withMap()],
  component: TransitiveOverlay,
  argTypes: {
    showRouteArrows: {
      control: "boolean",
      description: "Toggle to show or hide route arrows on the map"
    },
    accessLegColorOverride: {
      control: "color",
      description: "Override the color of the route"
    }
  },
  args: {
    showRouteArrows: false,
    accessLegColorOverride: null,
    visible: true
  }
};

const Template = injectIntl(
  ({ itinerary, mapCoords, mapZoom, intl, ...args }) => (
    <>
      <EndpointsOverlay
        fromLocation={getFromLocation(itinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(itinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(itinerary, { companies, intl })}
        {...args}
      />
    </>
  )
);

export const WalkingItinerary = Template.bind({});
WalkingItinerary.args = {
  itinerary: walkOnlyItinerary,
  mapCoords: [45.518841, -122.679302],
  mapZoom: 19
};

export const BikeOnlyItinerary = Template.bind({});
BikeOnlyItinerary.args = {
  itinerary: bikeOnlyItinerary,
  mapCoords: [45.520441, -122.68302],
  mapZoom: 16
};

export const WalkTransitWalkItinerary = Template.bind({});
WalkTransitWalkItinerary.args = {
  itinerary: walkTransitWalkItinerary,
  mapCoords: [45.520441, -122.68302],
  mapZoom: 16
};

export const WalkTransitWalkItineraryWithNoIntermediateStops = Template.bind(
  {}
);
WalkTransitWalkItineraryWithNoIntermediateStops.args = {
  itinerary: walkTransitWalkItineraryNoIntermediateStops,
  mapCoords: [45.525841, -122.649302],
  mapZoom: 13
};

export const BikeTransitBikeItinerary = Template.bind({});
BikeTransitBikeItinerary.args = {
  itinerary: bikeTransitBikeItinerary,
  mapCoords: [45.520441, -122.68302],
  mapZoom: 16
};

export const WalkInterlinedTransitItinerary = Template.bind({});
WalkInterlinedTransitItinerary.args = {
  itinerary: walkInterlinedTransitItinerary,
  mapCoords: [47.703022, -122.328041],
  mapZoom: 12.5
};

export const WalkTransitTransferItinerary = Template.bind({});
WalkTransitTransferItinerary.args = {
  itinerary: walkTransitWalkTransitWalkItinerary,
  mapCoords: [45.505841, -122.631302],
  mapZoom: 14
};

export const BikeRentalItinerary = Template.bind({});
BikeRentalItinerary.args = {
  itinerary: bikeRentalItinerary,
  mapCoords: [45.508841, -122.631302],
  mapZoom: 14
};

export const EScooterRentalItinerary = Template.bind({});
EScooterRentalItinerary.args = {
  itinerary: eScooterRentalItinerary,
  mapCoords: [45.52041, -122.675302],
  mapZoom: 16
};

export const ParkAndRideItinerary = Template.bind({});
ParkAndRideItinerary.args = {
  itinerary: parkAndRideItinerary,
  mapCoords: [45.515841, -122.75302],
  mapZoom: 13
};

export const BikeRentalTransitItinerary = Template.bind({});
BikeRentalTransitItinerary.args = {
  itinerary: bikeRentalTransitBikeRentalItinerary,
  mapCoords: [45.538841, -122.6302],
  mapZoom: 12
};

export const EScooterRentalTransitItinerary = Template.bind({});
EScooterRentalTransitItinerary.args = {
  itinerary: eScooterRentalTransiteScooterRentalItinerary,
  mapCoords: [45.538841, -122.6302],
  mapZoom: 12
};

export const TncTransitItinerary = Template.bind({});
TncTransitItinerary.args = {
  itinerary: tncTransitTncItinerary,
  mapCoords: [45.538841, -122.6302],
  mapZoom: 12
};

export const FlexItinerary = Template.bind({});
FlexItinerary.args = {
  itinerary: flexItinerary,
  mapCoords: [40.038487, -105.0529011],
  mapZoom: 11
};

export const OTP2ScooterItinerary = Template.bind({});
OTP2ScooterItinerary.args = {
  itinerary: otp2ScooterItinerary,
  mapCoords: [33.749, -84.388],
  mapZoom: 11
};
