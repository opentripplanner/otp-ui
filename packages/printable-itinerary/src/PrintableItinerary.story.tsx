import { ClassicLegIcon, TriMetLegIcon } from "@opentripplanner/icons";
import React from "react";
import styled from "styled-components";

import { Meta } from "@storybook/react";

// import mock itinaries. These are all trip plan outputs from OTP.
import bikeOnlyItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-only.json";
import bikeRentalItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental.json";
import bikeRentalTransitBikeRentalItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental-transit-bike-rental.json";
import bikeTransitBikeItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-transit-bike.json";
import eScooterRentalItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-rental.json";
import eScooterRentalTransiteScooterRentalItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-transit-e-scooter.json";
import parkAndRideItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/park-and-ride.json";
import tncTransitTncItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json";
import walkInterlinedTransitItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-interlined-transit-walk.json";
import walkOnlyItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-only.json";
import walkTransitWalkItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json";
import walkTransitWalkTransitWalkItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json";
import walkTransitWalkTransitWalkA11yItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk-with-accessibility-scores.json";
import config from "@opentripplanner/itinerary-body/src/__mocks__/config.json";
import otp2ScooterItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2-scooter.json";
import otp24Itinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2.4-transit-itinerary.json";
import PrintableItinerary from ".";
import * as PrintableItineraryClasses from "./styled";

const StyledPrintableItinerary = styled(PrintableItinerary)`
  ${PrintableItineraryClasses.LegBody} {
    background-color: pink;
  }
`;

export default {
  title: "PrintableItinerary",
  component: PrintableItinerary,
  parameters: { date: new Date("March 10, 2021 10:00:00") }
} as Meta;

export const WalkOnlyItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={walkOnlyItinerary}
    LegIcon={TriMetLegIcon}
  />
);

// OTP 2.4 type data
export const OTP24Itinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={otp24Itinerary}
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

export const WalkTransitWalkItineraryMetric = () => (
  <PrintableItinerary
    config={{ ...config, units: "metric" }}
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

export const OTP2ScooterItinerary = () => (
  <PrintableItinerary
    config={config}
    itinerary={otp2ScooterItinerary}
    LegIcon={ClassicLegIcon}
  />
);
