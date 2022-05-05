import flatten from "flat";
import React, { ReactElement } from "react";
import {
  ComponentMeta,
  ComponentStory,
  Parameters,
  StoryContext
} from "@storybook/react";
import styled from "styled-components";
// The below eslint-disable is due to https://github.com/storybookjs/storybook/issues/13408
// eslint-disable-next-line import/no-named-as-default
import TripDetails from ".";
import * as TripDetailsClasses from "./styled";
import {
  CaloriesDetailsProps,
  DepartureDetailsProps,
  TripDetailsProps
} from "./types";

import customMessages from "../__mocks__/custom-messages.yml";
import { FareDetails } from "./fare-detail";

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
const walkTransitWalkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const fareComponentsItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/fare-components.json");

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

const fareByLegLayout = [
  {
    header: "Adult",
    cols: [
      {
        key: "regular",
        header: "Cash"
      },
      {
        key: "electronicRegular",
        header: "ORCA"
      },
      {
        key: "electronicSpecial",
        header: "ORCA Lift"
      }
    ]
  },
  {
    header: "Youth",
    cols: [
      {
        key: "youth",
        header: "Cash"
      },
      {
        key: "electronicYouth",
        header: "ORCA"
      }
    ]
  },
  {
    header: "Senior",
    cols: [
      {
        key: "senior",
        header: "Cash"
      },
      {
        key: "electronicSenior",
        header: "ORCA"
      }
    ]
  },
  {
    header: "Miles 🙋",
    cols: [
      {
        key: "free",
        header: "schmoney"
      },
      {
        key: "electronicFree",
        header: "ORCA"
      }
    ]
  }
];

const longDateFormat = "MMMM D, YYYY";

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

// Custom slots for expandable detail sections.
const CustomDepartureDetails = ({
  departureDate
}: DepartureDetailsProps): ReactElement => (
  <>
    Custom messages about {departureDate.format(longDateFormat)} can be
    constructed dynamically using any markup.
  </>
);

const CustomCaloriesDetails = ({
  bikeSeconds,
  calories,
  walkSeconds
}: CaloriesDetailsProps): ReactElement => (
  <>
    Custom message about {calories} calories burned,
    {walkSeconds} seconds and {bikeSeconds} seconds.
  </>
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
      CaloriesDetails,
      DepartureDetails,
      itinerary,
      fareDetailsLayout
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
        CaloriesDetails={CaloriesDetails}
        DepartureDetails={DepartureDetails}
        fareKeyNameMap={fareKeyNameMap}
        itinerary={itinerary}
        fareDetailsLayout={fareDetailsLayout}
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
    // Hide all controls
    // (there are no args that the user can interactively change for this component).
    controls: {
      hideNoControlsWarning: true,
      include: []
    }
  },
  title: "TripDetails"
} as ComponentMeta<typeof TripDetails>;

export const WalkOnlyItinerary = makeStory({
  itinerary: walkOnlyItinerary
});

export const BikeOnlyItinerary = makeStory({
  itinerary: bikeOnlyItinerary
});

export const WalkTransitWalkItinerary = makeStory({
  itinerary: walkTransitWalkItinerary
});

export const StyledWalkTransitWalkItinerary = makeStory(
  {
    itinerary: walkTransitWalkItinerary
  },
  null,
  StyledTripDetails
);

export const BikeTransitBikeItinerary = makeStory({
  itinerary: bikeTransitBikeItinerary
});

export const WalkInterlinedTransitItinerary = makeStory(
  {
    defaultFareKey: "electronicRegular",
    itinerary: walkInterlinedTransitItinerary,
    fareDetailsLayout: fareByLegLayout
  },
  {
    useCustomFareKeyMap: true
  }
);

export const WalkTransitTransferItinerary = makeStory({
  itinerary: walkTransitWalkTransitWalkItinerary
});

export const BikeRentalItinerary = makeStory({
  itinerary: bikeRentalItinerary
});

export const EScooterRentalItinerary = makeStory({
  itinerary: eScooterRentalItinerary
});

export const ParkAndRideItinerary = makeStory({
  itinerary: parkAndRideItinerary
});

export const BikeRentalTransitItinerary = makeStory({
  itinerary: bikeRentalTransitBikeRentalItinerary
});

export const EScooterRentalTransitItinerary = makeStory({
  itinerary: eScooterRentalTransiteScooterRentalItinerary
});

export const TncTransitItinerary = makeStory(
  {
    itinerary: tncTransitTncItinerary
  },
  {
    useCustomFareKeyMap: true
  }
);

const flattenedMessages = flatten(customMessages);
export const TncTransitItineraryWithCustomMessages = makeStory(
  {
    CaloriesDetails: CustomCaloriesDetails,
    defaultFareKey: "electronicRegular",
    DepartureDetails: CustomDepartureDetails,
    itinerary: tncTransitTncItinerary
  },
  {
    // For illustration purposes,
    // override a subset of localized strings with custom messages.
    reactIntl: {
      messages: {
        "en-US": flattenedMessages,
        fr: flattenedMessages
      }
    },
    useCustomFareKeyMap: true
  },
  StyledTripDetails
);

export const FlexItinerary = makeStory({
  itinerary: fareComponentsItinerary
});

const exampleItinerary = walkInterlinedTransitItinerary;
export const FareDetailsComponent = () => (
  <FareDetails
    transitFares={exampleItinerary.fare}
    legs={exampleItinerary.legs}
    layout={fareByLegLayout}
  />
);
