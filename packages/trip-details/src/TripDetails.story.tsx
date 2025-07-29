import flatten from "flat";
import React, { ReactElement } from "react";
import { FormattedDate } from "react-intl";
import { Meta, Parameters, StoryContext, StoryObj } from "@storybook/react";
import styled from "styled-components";
import { convertGraphQLResponseToLegacy } from "@opentripplanner/core-utils/lib/itinerary";
// The below eslint-disable is due to https://github.com/storybookjs/storybook/issues/13408
// eslint-disable-next-line import/no-named-as-default
import TripDetails, { FareLegTable } from ".";
import * as TripDetailsClasses from "./styled";
import {
  TimeActiveDetailsProps,
  DepartureDetailsProps,
  FareDetailsProps,
  FareTableLayout,
  TripDetailsProps
} from "./types";

import customEnglishMessages from "../__mocks__/custom-english-messages.yml";
import customFrenchMessages from "../__mocks__/custom-french-messages.yml";

// import mock itinaries. These are all trip plan outputs from OTP.
import bikeOnlyItinerary from "../../itinerary-body/src/__mocks__/itineraries/bike-only.json";
import tncTransitTncItinerary from "../../itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json";
import walkOnlyItinerary from "../../itinerary-body/src/__mocks__/itineraries/walk-only.json";
import walkTransitWalkItinerary from "../../itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json";
import walkTransitWalkTransitWalkItinerary from "../../itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json";
import flexItinerary from "../../itinerary-body/src/__mocks__/itineraries/flex-itinerary.json";
import otp2ScooterItinerary from "../../itinerary-body/src/__mocks__/itineraries/otp2-scooter.json";
import otp2FareProducts from "../../itinerary-body/src/__mocks__/itineraries/leg-fare-products.json";

const flattenedEnglishMessages = flatten(customEnglishMessages);
const flattenedFrenchMessages = flatten(customFrenchMessages);

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

const orcaFareByLegLayout: FareTableLayout[] = [
  {
    cols: [
      {
        columnHeaderKey: "cash",
        mediumId: "orca:cash",
        riderCategoryId: "orca:regular"
      },
      {
        columnHeaderKey: "electronic",
        mediumId: "orca:electronic",
        riderCategoryId: "orca:regular"
      },
      {
        columnHeaderKey: "special",
        mediumId: "orca:electronic",
        riderCategoryId: "orca:special"
      }
    ],
    headerKey: "regular"
  },
  {
    cols: [
      {
        columnHeaderKey: "cash",
        mediumId: "orca:cash",
        riderCategoryId: "orca:youth"
      },
      {
        columnHeaderKey: "electronic",
        mediumId: "orca:electronic",
        riderCategoryId: "orca:youth"
      },
      {
        columnHeaderKey: "test",
        mediumId: "invalidkey",
        riderCategoryId: "invalidkey"
      }
    ],
    headerKey: "youth"
  },
  {
    headerKey: "senior",
    cols: [
      {
        columnHeaderKey: "cash",
        mediumId: "orca:cash",
        riderCategoryId: "orca:senior"
      },
      {
        columnHeaderKey: "electronic",
        mediumId: "orca:electronic",
        riderCategoryId: "orca:senior"
      }
    ]
  }
];

const orcaDefaultFareType = {
  headerKey: "cash-regular",
  mediumId: "orca:cash",
  riderCategoryId: "orca:regular"
};

const englishFareKeyMap = {
  regular: "Transit Fare",
  student: "Student Fare",
  senior: "Senior Fare",
  tram: "Tram Fare",
  special: "Special Fare",
  youth: "Youth Fare",
  electronicRegular: "Orca Fare",
  electronicYouth: "Orca Youth Fare",
  electronicSpecial: "Orca Special Fare",
  electronicSenior: "Orca Senior Fare"
};

const frenchFareKeyMap = {
  regular: "Tarif en transports",
  student: "Tarif étudiants",
  senior: "Tarif séniors",
  tram: "Tarif tram",
  special: "Tarif spécial",
  youth: "Tarif jeunes",
  electronicRegular: "Tarif Orca",
  electronicYouth: "Tarif Orca jeunes",
  electronicSpecial: "Tarif Orca spécial",
  electronicSenior: "Tarif Orca séniors"
};

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
): StoryObj<typeof TripDetails> {
  const TripDetailsTemplate = (
    {
      DepartureDetails,
      FareDetails,
      fareConfig = {},
      itinerary,
      TimeActiveDetails,
      showApproximateMinutesActive
    }: TripDetailsProps,
    { globals, parameters }: StoryContext
  ): ReactElement => {
    const { locale } = globals;
    const { useCustomFareKeyMap } = parameters;
    if (useCustomFareKeyMap) {
      fareConfig.fareKeyNameMap =
        locale === "en-US" ? englishFareKeyMap : frenchFareKeyMap;
    }
    return (
      <Component
        TimeActiveDetails={TimeActiveDetails}
        DepartureDetails={DepartureDetails}
        FareDetails={FareDetails}
        fareConfig={fareConfig}
        itinerary={itinerary}
        co2Config={defaultCo2Config}
        showApproximateMinutesActive={showApproximateMinutesActive}
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
  args: {
    defaultFareKey: "regular"
  },
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
  fareConfig: {
    defaultFareType: orcaDefaultFareType,
    fareDetailsLayout: orcaFareByLegLayout
  },
  itinerary: otp2FareProducts
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
    fareConfig: {
      defaultFareType: {
        headerKey: "electronicRegular",
        mediumId: "orca:electronic",
        riderCategoryId: "orca:regular"
      }
    },
    DepartureDetails: CustomDepartureDetails,
    itinerary: tncTransitTncItinerary,
    TimeActiveDetails: CustomTimeActiveDetails
  },
  {
    // For illustration purposes,
    // override a subset of localized strings with custom messages.
    reactIntl: {
      messages: {
        "en-US": flattenedEnglishMessages,
        fr: flattenedFrenchMessages
      }
    },
    useCustomFareKeyMap: true
  },
  StyledTripDetails
);

export const OTP2FlexItinerary = makeStory({ itinerary: flexItinerary });

export const FareLegTableStoryLegProducts = (): ReactElement => {
  const otp1legs = otp2FareProducts.legs.map(convertGraphQLResponseToLegacy);
  return <FareLegTable layout={orcaFareByLegLayout} legs={otp1legs} />;
};
