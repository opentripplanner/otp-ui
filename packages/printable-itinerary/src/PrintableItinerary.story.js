import { ClassicLegIcon, TriMetLegIcon } from "@opentripplanner/icons";
import React from "react";
import styled from "styled-components";

import PrintableItinerary from ".";
import * as PrintableItineraryClasses from "./styled";

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
const walkTransitWalkTransitWalkA11yItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk-with-accessibility-scores.json");
const config = require("@opentripplanner/itinerary-body/src/__mocks__/config.json");

const StyledPrintableItinerary = styled(PrintableItinerary)`
  ${PrintableItineraryClasses.LegBody} {
    background-color: pink;
  }
`;

export default {
  title: "PrintableItinerary",
  component: PrintableItinerary
};

export const WalkOnlyItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={walkOnlyItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const BikeOnlyItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={bikeOnlyItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const WalkTransitWalkItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={walkTransitWalkItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const StyledWalkTransitWalkItinerary = () => (
  <StyledPrintableItinerary
    config={config}
    itinerary={walkTransitWalkItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const BikeTransitBikeItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={bikeTransitBikeItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const WalkInterlinedTransitItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={walkInterlinedTransitItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const WalkTransitTransferItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={walkTransitWalkTransitWalkItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const WalkTransitTransferWithA11yItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={walkTransitWalkTransitWalkA11yItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const BikeRentalItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={bikeRentalItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const EScooterRentalItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={eScooterRentalItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const ParkAndRideItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={parkAndRideItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const BikeRentalTransitItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={bikeRentalTransitBikeRentalItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const EScooterRentalTransitItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={eScooterRentalTransiteScooterRentalItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const TncTransitItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={tncTransitTncItinerary}
    LegIcon={TriMetLegIcon}
  />
);

export const ClassicIconsAndParkAndRideItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={parkAndRideItinerary}
    LegIcon={ClassicLegIcon}
  />
);
