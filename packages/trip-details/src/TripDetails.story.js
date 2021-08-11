/* eslint-disable react/prop-types */
import React from "react";
import { IntlProvider } from "react-intl";
import { boolean, select, withKnobs } from "@storybook/addon-knobs";
import styled from "styled-components";

import TripDetails from ".";
import * as TripDetailsClasses from "./styled";

import defaultEnglishMessages from "../i18n/en-US.yml";
import defaultFrenchMessages from "../i18n/fr.yml";
import customMessages from "./TripDetails.story.yml";

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

const StyledTripDetails = styled(TripDetails)`
  ${TripDetailsClasses.TripDetailsHeader} {
    background-color: pink;
  }
`;

const longDateFormat = "MMMM D, YYYY";

// Custom slots for expandable detail sections.
const CustomDepartureDetails = ({ departureDate }) => (
  <>
    Custom messages about {departureDate.format(longDateFormat)} can be
    constructed dynamically using any markup.
  </>
);

const CustomFareDetails = ({ maxTNCFare, minTNCFare, transitFare }) => (
  <>
    Custom details about fares (transitFare: {transitFare} (cents), minTNCFare:{" "}
    {minTNCFare} and maxTNCFare: {maxTNCFare} can be constructed dynamically
    using any markup.
  </>
);

const CustomCaloriesDetails = ({ bikeSeconds, calories, walkSeconds }) => (
  <>
    Custom message about {calories} calories burned,
    {walkSeconds} seconds and {bikeSeconds} seconds.
  </>
);

const TripDetailsWrapper = ({
  CaloriesDetails,
  Component = TripDetails,
  DepartureDetails,
  FareDetails,
  itinerary
}) => (
  <Component
    CaloriesDetails={CaloriesDetails}
    currency={select("Currency", ["USD", "EUR"], "USD")}
    DepartureDetails={DepartureDetails}
    FareDetails={FareDetails}
    itinerary={itinerary}
    timeOptions={{
      format: select("Time format", ["h:mm a", "HH:mm"], "h:mm a")
    }}
  />
);

const intlDecorator = story => {
  const useMessages = boolean("Use localized messages", true);
  const locale = select("Locale", ["en-US", "fr"], "en-US");
  const overrideDefaultMessages = boolean("Override default messages", false);
  const messages =
    locale === "en-US" ? defaultEnglishMessages : defaultFrenchMessages;
  // Construct a messages object that customizes a subset
  // of the default messages of the desired locale.
  const mergedMessages = overrideDefaultMessages
    ? {
        ...messages,
        ...customMessages
      }
    : messages;

  return (
    <IntlProvider
      locale={locale}
      messages={useMessages ? mergedMessages : null}
    >
      {story()}
    </IntlProvider>
  );
};

export default {
  components: TripDetails,
  decorators: [intlDecorator, withKnobs],
  title: "TripDetails"
};

export const WalkOnlyItinerary = () => (
  <TripDetailsWrapper itinerary={walkOnlyItinerary} />
);

export const BikeOnlyItinerary = () => (
  <TripDetailsWrapper itinerary={bikeOnlyItinerary} />
);

export const WalkTransitWalkItinerary = () => (
  <TripDetailsWrapper itinerary={walkTransitWalkItinerary} />
);

export const StyledWalkTransitWalkItinerary = () => (
  <TripDetailsWrapper
    Component={StyledTripDetails}
    itinerary={walkTransitWalkItinerary}
  />
);

export const BikeTransitBikeItinerary = () => (
  <TripDetailsWrapper itinerary={bikeTransitBikeItinerary} />
);

export const WalkInterlinedTransitItinerary = () => (
  <TripDetailsWrapper itinerary={walkInterlinedTransitItinerary} />
);

export const WalkTransitTransferItinerary = () => (
  <TripDetailsWrapper itinerary={walkTransitWalkTransitWalkItinerary} />
);

export const BikeRentalItinerary = () => (
  <TripDetailsWrapper itinerary={bikeRentalItinerary} />
);

export const EScooterRentalItinerary = () => (
  <TripDetailsWrapper itinerary={eScooterRentalItinerary} />
);

export const ParkAndRideItinerary = () => (
  <TripDetailsWrapper itinerary={parkAndRideItinerary} />
);

export const BikeRentalTransitItinerary = () => (
  <TripDetailsWrapper itinerary={bikeRentalTransitBikeRentalItinerary} />
);

export const EScooterRentalTransitItinerary = () => (
  <TripDetailsWrapper
    itinerary={eScooterRentalTransiteScooterRentalItinerary}
  />
);

export const TncTransitItinerary = () => (
  <TripDetailsWrapper itinerary={tncTransitTncItinerary} />
);

export const TncTransitItineraryWithCustomDetails = () => (
  <TripDetailsWrapper
    CaloriesDetails={CustomCaloriesDetails}
    Component={StyledTripDetails}
    DepartureDetails={CustomDepartureDetails}
    FareDetails={CustomFareDetails}
    itinerary={tncTransitTncItinerary}
  />
);
