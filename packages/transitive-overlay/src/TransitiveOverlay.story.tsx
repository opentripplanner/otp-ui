/* eslint-disable react/jsx-props-no-spreading */
import EndpointsOverlay from "@opentripplanner/endpoints-overlay";
import React from "react";
import { action } from "storybook/actions";
import { injectIntl } from "react-intl";

// import mock itinaries. These are all trip plan outputs from OTP.
import bikeOnlyItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-only.json";
import bikeRentalItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental.json";
import bikeRentalTransitBikeRentalItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental-transit-bike-rental.json";
import bikeTransitBikeItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-transit-bike.json";
import eScooterRentalItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-rental.json";
import eScooterRentalTransiteScooterRentalItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-transit-e-scooter.json";
import parkAndRideItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/park-and-ride.json";
import tncTransitTncItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json";
import walkInterlinedTransitItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-interlined-transit-walk.json";
import walkOnlyItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-only.json";
import walkTransitWalkItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json";
import walkTransitWalkItineraryNoIntermediateStops from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-no-intermediate-stops.json";
import walkTransitWalkTransitWalkItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json";
import flexItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/flex-itinerary.json";
import otp2ScooterItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2-scooter.json";
import otp2TransitItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2-transit-leg.json";
import { withMap } from "../../../.storybook/base-map-wrapper";
import TransitiveOverlay, { itineraryToTransitive } from ".";

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
  parameters: { storyshots: { disable: true } },
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

const Template = injectIntl(({ itinerary, intl, ...args }) => (
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
));

export const WalkingItinerary = Template.bind({});
WalkingItinerary.args = {
  itinerary: walkOnlyItinerary
};

export const BikeOnlyItinerary = Template.bind({});
BikeOnlyItinerary.args = {
  itinerary: bikeOnlyItinerary
};

export const WalkTransitWalkItinerary = Template.bind({});
WalkTransitWalkItinerary.args = {
  itinerary: walkTransitWalkItinerary
};

export const WalkTransitWalkItineraryWithNoIntermediateStops = Template.bind(
  {}
);
WalkTransitWalkItineraryWithNoIntermediateStops.args = {
  itinerary: walkTransitWalkItineraryNoIntermediateStops
};

export const BikeTransitBikeItinerary = Template.bind({});
BikeTransitBikeItinerary.args = {
  itinerary: bikeTransitBikeItinerary
};

export const WalkInterlinedTransitItinerary = Template.bind({});
WalkInterlinedTransitItinerary.args = {
  itinerary: walkInterlinedTransitItinerary
};

export const WalkTransitTransferItinerary = Template.bind({});
WalkTransitTransferItinerary.args = {
  itinerary: walkTransitWalkTransitWalkItinerary
};

export const BikeRentalItinerary = Template.bind({});
BikeRentalItinerary.args = {
  itinerary: bikeRentalItinerary
};

export const EScooterRentalItinerary = Template.bind({});
EScooterRentalItinerary.args = {
  itinerary: eScooterRentalItinerary
};

export const ParkAndRideItinerary = Template.bind({});
ParkAndRideItinerary.args = {
  itinerary: parkAndRideItinerary
};

export const BikeRentalTransitItinerary = Template.bind({});
BikeRentalTransitItinerary.args = {
  itinerary: bikeRentalTransitBikeRentalItinerary
};

export const EScooterRentalTransitItinerary = Template.bind({});
EScooterRentalTransitItinerary.args = {
  itinerary: eScooterRentalTransiteScooterRentalItinerary
};

export const TncTransitItinerary = Template.bind({});
TncTransitItinerary.args = {
  itinerary: tncTransitTncItinerary
};

export const FlexItinerary = Template.bind({});
FlexItinerary.args = {
  itinerary: flexItinerary
};

export const OTP2ScooterItinerary = Template.bind({});
OTP2ScooterItinerary.args = {
  itinerary: otp2ScooterItinerary
};

export const OTP2TransitItinerary = Template.bind({});
OTP2TransitItinerary.args = {
  itinerary: otp2TransitItinerary
};
