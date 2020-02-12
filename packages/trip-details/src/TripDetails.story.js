import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
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
  ${TripDetailsClasses.LegBody} {
    background-color: pink;
  }
`;

const longDateFormat = "MMMM D, YYYY";

storiesOf("TripDetails", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ItineraryBody with walk-only itinerary", () => (
    <TripDetails
      itinerary={walkOnlyItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with bike-only itinerary", () => (
    <TripDetails
      itinerary={bikeOnlyItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with walk-transit-walk itinerary", () => (
    <TripDetails
      itinerary={walkTransitWalkItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("Styled ItineraryBody with walk-transit-walk itinerary", () => (
    <StyledTripDetails
      itinerary={walkTransitWalkItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with bike-transit-bike itinerary", () => (
    <TripDetails
      itinerary={bikeTransitBikeItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with walk-interlined-transit itinerary", () => (
    <TripDetails
      itinerary={walkInterlinedTransitItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with walk-transit-transfer itinerary", () => (
    <TripDetails
      itinerary={walkTransitWalkTransitWalkItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with bike-rental itinerary", () => (
    <TripDetails
      itinerary={bikeRentalItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with E-scooter-rental itinerary", () => (
    <TripDetails
      itinerary={eScooterRentalItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with park and ride itinerary", () => (
    <TripDetails
      itinerary={parkAndRideItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with bike rental + transit itinerary", () => (
    <TripDetails
      itinerary={bikeRentalTransitBikeRentalItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with E-scooter rental + transit itinerary", () => (
    <TripDetails
      itinerary={eScooterRentalTransiteScooterRentalItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("ItineraryBody with TNC + transit itinerary", () => (
    <TripDetails
      itinerary={tncTransitTncItinerary}
      longDateFormat={longDateFormat}
    />
  ));
