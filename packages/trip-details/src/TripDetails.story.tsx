import React, { ReactElement } from "react";
import { FormattedDate } from "react-intl";
import { Meta, Parameters, StoryObj } from "@storybook/react";
import styled from "styled-components";
// The below eslint-disable is due to https://github.com/storybookjs/storybook/issues/13408
// eslint-disable-next-line import/no-named-as-default
import TripDetails, { FaresV2Table } from ".";
import * as TripDetailsClasses from "./styled";
import {
  TimeActiveDetailsProps,
  DepartureDetailsProps,
  FareDetailsProps,
  TripDetailsProps
} from "./types";

// import mock itinaries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-only.json");
const tncTransitTncItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json");
const walkOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const flexItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2.4-transit-itinerary.json");
const otp2ScooterItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2-scooter.json");
const otp2FareProducts = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/leg-fare-products.json");
// const multipleFareOptionsItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/fares-v2-multiple-options.json");
const faresv2ItineraryWithTransfer = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/fares-v2-with-transfer.json");
const faresv2Itinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/fares-v2-fare-components.json");

// Change currency code on one of the itineraries for illustration.
// (other currency fields in the itinerary object are not used for display).
const itinCurrency =
  walkTransitWalkTransitWalkItinerary.fare.fare.regular.currency;
itinCurrency.currencyCode = "EUR";

const StyledTripDetails = styled(TripDetails)`
  ${TripDetailsClasses.TripDetailsHeader} {
    background-color: pink;
  }
`;

const defaultCo2Config = {
  enabled: true
};

const CustomFareDetails = ({
  legs,
  maxTNCFare,
  minTNCFare
}: FareDetailsProps): ReactElement => (
  <>
    Custom details about fares (legs: {JSON.stringify(legs)}, maxTNCFare:{" "}
    {maxTNCFare}, minTNCFare: {minTNCFare}) (cents), can be constructed
    dynamically using any markup.
  </>
);

// Custom slots for expandable detail sections.
const CustomDepartureDetails = ({
  departureDate
}: DepartureDetailsProps): ReactElement => (
  <>
    Custom messages about{" "}
    <FormattedDate
      value={departureDate}
      year="numeric"
      month="long"
      day="numeric"
    />{" "}
    can be constructed dynamically using any markup.
  </>
);

const CustomTimeActiveDetails = ({
  minutesActive
}: TimeActiveDetailsProps): ReactElement => (
  <>Custom message about {minutesActive} active minutes.</>
);

/**
 * Create a template component for each TripDetails story.
 * A Component argument is passed. Once bound,
 * the Component to render should not change.
 * @param Component The component to render.
 */
function createTripDetailsTemplate(
  Component: typeof TripDetails = TripDetails
) {
  const TripDetailsTemplate = ({
    defaultFareType,
    DepartureDetails,
    FareDetails,
    itinerary,
    TimeActiveDetails,
    showApproximateMinutesActive
  }: TripDetailsProps): ReactElement => {
    return (
      <Component
        co2Config={defaultCo2Config}
        defaultFareType={defaultFareType}
        DepartureDetails={DepartureDetails}
        FareDetails={FareDetails}
        itinerary={itinerary}
        showApproximateMinutesActive={showApproximateMinutesActive}
        TimeActiveDetails={TimeActiveDetails}
      />
    );
  };
  return TripDetailsTemplate;
}

/**
 * Helper to simplify story declaration.
 */
function makeStory(
  args: TripDetailsProps,
  parameters?: Parameters,
  Component?: typeof TripDetails
): StoryObj<typeof TripDetails> {
  const BoundTripDetails = createTripDetailsTemplate(Component).bind({});
  BoundTripDetails.args = args;
  BoundTripDetails.parameters = parameters;
  return BoundTripDetails;
}

export default {
  component: TripDetails,
  parameters: {
    date: new Date("March 10, 2021 10:00:00"),
    // Hide all controls
    // (there are no args that the user can interactively change for this component).
    controls: {
      hideNoControlsWarning: true,
      include: []
    }
  },
  title: "TripDetails"
} as Meta;

export const WalkOnlyItinerary = makeStory({
  itinerary: walkOnlyItinerary
});

export const ApproximatePrefixItinerary = makeStory({
  itinerary: walkOnlyItinerary,
  showApproximateMinutesActive: true
});

export const BikeOnlyItinerary = makeStory({
  itinerary: bikeOnlyItinerary
});

export const WalkTransitWalkItinerary = makeStory({
  itinerary: walkTransitWalkItinerary
});

export const StyledItinerary = makeStory(
  {
    itinerary: walkTransitWalkItinerary
  },
  undefined,
  StyledTripDetails
);

export const LegFareProductsItinerary = makeStory({
  itinerary: otp2FareProducts,
  defaultFareType: { mediumId: "electronic", riderCategoryId: "regular" }
});

// The render of this itinerary is uninteresting, but the test
// is if we can parse an OTP2 itinerary without crashing
export const OTP2EScooterRentalTransitItinerary = makeStory({
  itinerary: otp2ScooterItinerary
});

export const TncTransitItinerary = makeStory(
  {
    FareDetails: CustomFareDetails,
    itinerary: tncTransitTncItinerary
  },
  {
    useCustomFareKeyMap: true
  }
);

export const TncTransitItineraryWithCustomMessages = makeStory(
  {
    DepartureDetails: CustomDepartureDetails,
    itinerary: tncTransitTncItinerary,
    TimeActiveDetails: CustomTimeActiveDetails
  },
  {
    // For illustration purposes,
    // override a subset of localized strings with custom messages.
    useCustomFareKeyMap: true
  },
  StyledTripDetails
);

export const OTP2FlexItinerary = makeStory({ itinerary: flexItinerary });

export const FaresV2TableStory = (): ReactElement => {
  return (
    <>
      {/* <FaresV2Table legs={multipleFareOptionsItinerary.legs} /> */}
      <FaresV2Table legs={faresv2Itinerary.legs} favoriteMediumId="3" />
      <FaresV2Table legs={faresv2ItineraryWithTransfer.legs} />
      <FaresV2Table legs={otp2FareProducts.legs} />
    </>
  );
};
