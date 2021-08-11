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

const intlDecorator = story => {
  const useMessages = boolean("Use localized messages", false);
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
  <TripDetails itinerary={walkOnlyItinerary} />
);

export const BikeOnlyItinerary = () => (
  <TripDetails itinerary={bikeOnlyItinerary} />
);

export const WalkTransitWalkItinerary = () => (
  <TripDetails itinerary={walkTransitWalkItinerary} />
);

export const StyledWalkTransitWalkItinerary = () => (
  <StyledTripDetails itinerary={walkTransitWalkItinerary} />
);

export const BikeTransitBikeItinerary = () => (
  <TripDetails itinerary={bikeTransitBikeItinerary} />
);

export const WalkInterlinedTransitItinerary = () => (
  <TripDetails itinerary={walkInterlinedTransitItinerary} />
);

export const WalkTransitTransferItinerary = () => (
  <TripDetails itinerary={walkTransitWalkTransitWalkItinerary} />
);

export const BikeRentalItinerary = () => (
  <TripDetails itinerary={bikeRentalItinerary} />
);

export const EScooterRentalItinerary = () => (
  <TripDetails itinerary={eScooterRentalItinerary} />
);

export const ParkAndRideItinerary = () => (
  <TripDetails itinerary={parkAndRideItinerary} />
);

export const BikeRentalTransitItinerary = () => (
  <TripDetails itinerary={bikeRentalTransitBikeRentalItinerary} />
);

export const EScooterRentalTransitItinerary = () => (
  <TripDetails itinerary={eScooterRentalTransiteScooterRentalItinerary} />
);

export const TncTransitItinerary = () => (
  <TripDetails itinerary={tncTransitTncItinerary} />
);

export const TncTransitItineraryWithCustomizations = () => (
  <StyledTripDetails
    CaloriesDetails={CustomCaloriesDetails}
    currency={select("Currency", ["USD", "EUR"], "USD")}
    DepartureDetails={CustomDepartureDetails}
    FareDetails={CustomFareDetails}
    itinerary={tncTransitTncItinerary}
    timeOptions={
      select("Time format", ["12-hour", "24-hour"], "12-hour") === "12-hour"
        ? { format: "h:mm a" }
        : { format: "HH:mm" }
    }
  />
);
