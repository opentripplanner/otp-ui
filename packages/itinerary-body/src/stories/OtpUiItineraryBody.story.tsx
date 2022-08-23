import React, { ReactElement } from "react";
import { Bomb } from "@styled-icons/fa-solid/Bomb";
import { Bolt } from "@styled-icons/fa-solid/Bolt";
import styled from "styled-components";

import ItineraryBody from "..";
import {
  CustomPlaceName,
  customToRouteAbbreviation,
  CustomTransitLegSummary
} from "../demos";
import ItineraryBodyDefaultsWrapper from "./itinerary-body-defaults-wrapper";

// import mock itineraries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("../__mocks__/itineraries/bike-only.json");
const bikeRentalItinerary = require("../__mocks__/itineraries/bike-rental.json");
const bikeRentalTransitBikeRentalItinerary = require("../__mocks__/itineraries/bike-rental-transit-bike-rental.json");
const bikeTransitBikeItinerary = require("../__mocks__/itineraries/bike-transit-bike.json");
const eScooterRentalItinerary = require("../__mocks__/itineraries/e-scooter-rental.json");
const eScooterRentalTransiteScooterRentalItinerary = require("../__mocks__/itineraries/e-scooter-transit-e-scooter.json");
const parkAndRideItinerary = require("../__mocks__/itineraries/park-and-ride.json");
const tncTransitTncItinerary = require("../__mocks__/itineraries/tnc-transit-tnc.json");
const walkInterlinedTransitItinerary = require("../__mocks__/itineraries/walk-interlined-transit-walk.json");
const walkOnlyItinerary = require("../__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("../__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkTransitWalkItinerary = require("../__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const fareComponentsItinerary = require("../__mocks__/itineraries/fare-components.json");
const walkTransitWalkTransitWalkA11yItinerary = require("../__mocks__/itineraries/walk-transit-walk-transit-walk-with-accessibility-scores.json");
const otp2ScooterItinerary = require("../__mocks__/itineraries/otp2-scooter.json");
const flexItinerary = require("../__mocks__/itineraries/flex-itinerary.json");

const a11yOverrideParameters = {
  a11y: { config: { rules: [{ id: "color-contrast", reviewOnFail: true }] } }
};

export default {
  title: "ItineraryBody/otp-ui",
  component: ItineraryBody
};

export const WalkOnlyItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={walkOnlyItinerary} />
);

export const BikeOnlyItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={bikeOnlyItinerary} />
);

export const WalkTransitWalkItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={walkTransitWalkItinerary} />
);

export const WalkTransitTransferWithA11yItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkTransitWalkA11yItinerary}
  />
);

export const StyledWalkTransitWalkItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    styledItinerary="pink-legs"
  />
);
// Custom styling for this story only, not in production
StyledWalkTransitWalkItinerary.parameters = a11yOverrideParameters;

export const WalkTransitWalkItineraryWithAgencyInformation = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    showAgencyInfo
  />
);

export const WalkTransitWalkItineraryWithCustomTransitLegSummaryComponent = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    TransitLegSummary={CustomTransitLegSummary}
  />
);

export const WalkTransitWalkItineraryWithCustomPlaceNameComponent = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    PlaceName={CustomPlaceName}
  />
);

export const WalkTransitWalkItineraryWithCustomViewTripButtonActivatedAndCustomRouteAbbreviation = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    showViewTripButton
    toRouteAbbreviation={customToRouteAbbreviation}
  />
);

export const BikeTransitBikeItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={bikeTransitBikeItinerary} />
);

export const WalkInterlinedTransitItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={walkInterlinedTransitItinerary} />
);
// Custom styling for this story only, not in production
WalkInterlinedTransitItinerary.parameters = a11yOverrideParameters;

export const WalkTransitTransferItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkTransitWalkItinerary}
  />
);

export const BikeRentalItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={bikeRentalItinerary} />
);

export const EScooterRentalItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={eScooterRentalItinerary} />
);

export const ParkAndRideItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={parkAndRideItinerary} />
);

export const BikeRentalTransitItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={bikeRentalTransitBikeRentalItinerary}
  />
);

export const EScooterRentalTransitItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={eScooterRentalTransiteScooterRentalItinerary}
  />
);

export const TncTransitItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={tncTransitTncItinerary} />
);

export const OTP2ScooterItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={otp2ScooterItinerary} />
);

export const OTP2FlexItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={flexItinerary} />
);

export const IndividualLegFareComponents = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={fareComponentsItinerary}
    showRouteFares
  />
);

export const CustomAlertIconsItinerary = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    AlertToggleIcon={styled(Bolt).attrs({ size: 15 })``}
    AlertBodyIcon={styled(Bomb).attrs({ size: 18 })``}
  />
);

export const ThreeAlertsAlwaysCollapsing = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    shouldAlwaysCollapseAlerts
  />
);

export const TwoAlertsAlwaysCollapsing = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={parkAndRideItinerary}
    shouldAlwaysCollapseAlerts
  />
);

export const ZeroAlertsAlwaysCollapsing = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkInterlinedTransitItinerary}
    shouldAlwaysCollapseAlerts
  />
);

export const ThreeAlertsNotAlwaysCollapsing = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    shouldAlwaysCollapseAlerts={false}
  />
);

export const TwoAlertsNotAlwaysCollapsing = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={parkAndRideItinerary}
    shouldAlwaysCollapseAlerts={false}
  />
);

export const ZeroAlertsNotAlwaysCollapsing = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkInterlinedTransitItinerary}
    shouldAlwaysCollapseAlerts={false}
  />
);

export const ThreeAlertsWithoutCollapsingProp = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={walkTransitWalkItinerary} />
);

export const TwoAlertWithoutCollapsingProp = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={parkAndRideItinerary} />
);

export const ZeroAlertsWithoutCollapsingProp = (): ReactElement => (
  <ItineraryBodyDefaultsWrapper itinerary={walkInterlinedTransitItinerary} />
);
