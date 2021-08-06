/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";

import TripDetails from ".";
import * as TripDetailsClasses from "./styled";

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

const CustomDepartureDetails = ({ startTime }) => (
  <>
    Custom messages about {startTime} can be constructed dynamically using any
    markup, including formatting markup from a string localization library.
  </>
);

const CustomTransitFare = ({ fareData }) => {
  const { centsToString, transitFare } = fareData;
  return (
    <>
      <b>{centsToString(transitFare)}</b> transit ticket
    </>
  );
};

const CustomFareDetails = ({ fareData }) => (
  <>
    Custom details about fares (transitFare: {fareData.transitFare} (cents),
    minTNCFare: {fareData.minTNCFare} and maxTNCFare: {fareData.maxTNCFare} can
    be constructed dynamically using any markup, including formatting markup
    from a string localization library.
  </>
);

const CustomCaloriesDetails = ({ bikeDuration, calories, walkDuration }) => (
  <>
    Custom message about {calories} calories burned,
    {walkDuration} seconds and {bikeDuration} seconds.
  </>
);

const longDateFormat = "MMMM D, YYYY";

export default {
  components: TripDetails,
  title: "TripDetails"
};

export const WalkOnlyItinerary = () => (
  <TripDetails itinerary={walkOnlyItinerary} longDateFormat={longDateFormat} />
);

export const BikeOnlyItinerary = () => (
  <TripDetails itinerary={bikeOnlyItinerary} longDateFormat={longDateFormat} />
);

export const WalkTransitWalkItinerary = () => (
  <TripDetails
    itinerary={walkTransitWalkItinerary}
    longDateFormat={longDateFormat}
  />
);

export const WalkTransitWalkItineraryWithCustomMessages = () => {
  return (
    <TripDetails
      CaloriesDetails={CustomCaloriesDetails}
      DepartureDetails={CustomDepartureDetails}
      FareDetails={CustomFareDetails}
      itinerary={walkTransitWalkItinerary}
      longDateFormat={longDateFormat}
      title="Custom Details About This Trip"
      TransitFare={CustomTransitFare}
    />
  );
};

export const StyledWalkTransitWalkItinerary = () => (
  <StyledTripDetails
    itinerary={walkTransitWalkItinerary}
    longDateFormat={longDateFormat}
  />
);

export const BikeTransitBikeItinerary = () => (
  <TripDetails
    itinerary={bikeTransitBikeItinerary}
    longDateFormat={longDateFormat}
  />
);

export const WalkInterlinedTransitItinerary = () => (
  <TripDetails
    itinerary={walkInterlinedTransitItinerary}
    longDateFormat={longDateFormat}
  />
);

export const WalkTransitTransferItinerary = () => (
  <TripDetails
    itinerary={walkTransitWalkTransitWalkItinerary}
    longDateFormat={longDateFormat}
  />
);

export const BikeRentalItinerary = () => (
  <TripDetails
    itinerary={bikeRentalItinerary}
    longDateFormat={longDateFormat}
  />
);

export const EScooterRentalItinerary = () => (
  <TripDetails
    itinerary={eScooterRentalItinerary}
    longDateFormat={longDateFormat}
  />
);

export const ParkAndRideItinerary = () => (
  <TripDetails
    itinerary={parkAndRideItinerary}
    longDateFormat={longDateFormat}
  />
);

export const BikeRentalTransitItinerary = () => (
  <TripDetails
    itinerary={bikeRentalTransitBikeRentalItinerary}
    longDateFormat={longDateFormat}
  />
);

export const EScooterRentalTransitItinerary = () => (
  <TripDetails
    itinerary={eScooterRentalTransiteScooterRentalItinerary}
    longDateFormat={longDateFormat}
  />
);

export const TncTransitItinerary = () => (
  <TripDetails
    itinerary={tncTransitTncItinerary}
    longDateFormat={longDateFormat}
  />
);
