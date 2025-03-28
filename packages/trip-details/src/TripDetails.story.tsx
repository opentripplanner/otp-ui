import flatten from "flat";
import React, { ReactElement } from "react";
import { FormattedDate } from "react-intl";
import {
  ComponentStory,
  Meta,
  Parameters,
  StoryContext
} from "@storybook/react";
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
const bikeOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-only.json");
const tncTransitTncItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json");
const walkOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const flexItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/flex-itinerary.json");
const otp2ScooterItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2-scooter.json");
const otp2FareProducts = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/leg-fare-products.json");

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
  transitFares
}: FareDetailsProps): ReactElement => (
  <>
    Custom details about fares (transitFares: {JSON.stringify(transitFares)}){" "}
    (cents), can be constructed dynamically using any markup.
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
): ComponentStory<typeof TripDetails> {
  const TripDetailsTemplate = (
    {
      defaultFareType,
      DepartureDetails,
      FareDetails,
      fareDetailsLayout,
      itinerary,
      TimeActiveDetails,
      showApproximateMinutesActive
    }: TripDetailsProps,
    { globals, parameters }: StoryContext
  ): ReactElement => {
    const { locale } = globals;
    const { useCustomFareKeyMap } = parameters;
    const fareKeyNameMap = useCustomFareKeyMap
      ? locale === "en-US"
        ? englishFareKeyMap
        : frenchFareKeyMap
      : {};
    return (
      <Component
        TimeActiveDetails={TimeActiveDetails}
        DepartureDetails={DepartureDetails}
        FareDetails={FareDetails}
        fareDetailsLayout={fareDetailsLayout}
        fareKeyNameMap={fareKeyNameMap}
        itinerary={itinerary}
        co2Config={defaultCo2Config}
        defaultFareType={defaultFareType}
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
): ComponentStory<typeof TripDetails> {
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
  null,
  StyledTripDetails
);

export const LegFareProductsItinerary = makeStory({
  defaultFareType: orcaDefaultFareType,
  fareDetailsLayout: orcaFareByLegLayout,
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
    defaultFareType: {
      headerKey: "electronicRegular",
      mediumId: "orca:electronic",
      riderCategoryId: "orca:regular"
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
