import TriMetLegIcon from "@opentripplanner/icons/lib/trimet-leg-icon";
import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import styled from "styled-components";

import PrintableItinerary from ".";
import * as ItineraryBodyClasses from "./styled";

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
const config = require("@opentripplanner/itinerary-body/src/__mocks__/config.json");

const StyledPrintableItinerary = styled(PrintableItinerary)`
  ${ItineraryBodyClasses.LegBody} {
    background-color: pink;
  }
`;

storiesOf("PrintableItinerary", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ItineraryBody with walk-only itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={walkOnlyItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with bike-only itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={bikeOnlyItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with walk-transit-walk itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={walkTransitWalkItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("Styled ItineraryBody with walk-transit-walk itinerary", () => (
    <StyledPrintableItinerary
      config={config}
      itinerary={walkTransitWalkItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with bike-transit-bike itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={bikeTransitBikeItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with walk-interlined-transit itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={walkInterlinedTransitItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with walk-transit-transfer itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={walkTransitWalkTransitWalkItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with bike-rental itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={bikeRentalItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with E-scooter-rental itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={eScooterRentalItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with park and ride itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={parkAndRideItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with bike rental + transit itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={bikeRentalTransitBikeRentalItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with E-scooter rental + transit itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={eScooterRentalTransiteScooterRentalItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with TNC + transit itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={tncTransitTncItinerary}
      LegIcon={TriMetLegIcon}
    />
  ));
