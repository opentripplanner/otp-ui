import coreUtils from "@opentripplanner/core-utils";
import { ClassicLegIcon } from "@opentripplanner/icons";
import PropTypes from "prop-types";
import React from "react";
import { Bomb } from "@styled-icons/fa-solid/Bomb";
import { Bolt } from "@styled-icons/fa-solid/Bolt";
import styled from "styled-components";

import ItineraryBody from "..";
import {
  CustomPlaceName,
  customToRouteAbbreviation,
  CustomTransitLegSummary,
  WrappedOtpRRTransitLegSubheader
} from "../demos";
import ItineraryBodyDefaultsWrapper from "./itinerary-body-defaults-wrapper";
import OtpRRLineColumnContent from "../otp-react-redux/line-column-content";
import { PlaceName as OtpRRPlaceName } from "../otp-react-redux";
import OtpRRRouteDescription from "../otp-react-redux/route-description";

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

function OtpRRItineraryBodyWrapper({
  itinerary,
  showRouteFares,
  TimeColumnContent
}) {
  return (
    <ItineraryBodyDefaultsWrapper
      itinerary={itinerary}
      LegIcon={ClassicLegIcon}
      LineColumnContent={OtpRRLineColumnContent}
      PlaceName={OtpRRPlaceName}
      RouteDescription={OtpRRRouteDescription}
      showAgencyInfo
      showLegIcon
      showMapButtonColumn={false}
      showRouteFares={showRouteFares}
      showViewTripButton
      styledItinerary="otp-rr"
      TimeColumnContent={TimeColumnContent}
      TransitLegSubheader={WrappedOtpRRTransitLegSubheader}
    />
  );
}

const a11yOverrideParameters = {
  a11y: { config: { rules: [{ id: "color-contrast", reviewOnFail: true }] } }
};

OtpRRItineraryBodyWrapper.propTypes = {
  itinerary: coreUtils.types.itineraryType.isRequired,
  showRouteFares: PropTypes.bool,
  TimeColumnContent: PropTypes.elementType
};
OtpRRItineraryBodyWrapper.defaultProps = {
  showRouteFares: undefined,
  TimeColumnContent: undefined
};

export default {
  title: "ItineraryBody/otp-ui",
  component: ItineraryBody
};

export const WalkOnlyItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={walkOnlyItinerary} />
);

export const BikeOnlyItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={bikeOnlyItinerary} />
);

export const WalkTransitWalkItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={walkTransitWalkItinerary} />
);

export const WalkTransitTransferWithA11yItinerary = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkTransitWalkA11yItinerary}
  />
);

export const StyledWalkTransitWalkItinerary = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    styledItinerary="pink-legs"
  />
);
// Custom styling for this story only, not in production
StyledWalkTransitWalkItinerary.parameters = a11yOverrideParameters;

export const WalkTransitWalkItineraryWithAgencyInformation = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    showAgencyInfo
  />
);

export const WalkTransitWalkItineraryWithCustomTransitLegSummaryComponent = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    TransitLegSummary={CustomTransitLegSummary}
  />
);

export const WalkTransitWalkItineraryWithCustomPlaceNameComponent = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    PlaceName={CustomPlaceName}
  />
);

export const WalkTransitWalkItineraryWithCustomViewTripButtonActivatedAndCustomRouteAbbreviation = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    showViewTripButton
    toRouteAbbreviation={customToRouteAbbreviation}
  />
);

export const BikeTransitBikeItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={bikeTransitBikeItinerary} />
);

export const WalkInterlinedTransitItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={walkInterlinedTransitItinerary} />
);
// Custom styling for this story only, not in production
WalkInterlinedTransitItinerary.parameters = a11yOverrideParameters;

export const WalkTransitTransferItinerary = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkTransitWalkItinerary}
  />
);

export const BikeRentalItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={bikeRentalItinerary} />
);

export const EScooterRentalItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={eScooterRentalItinerary} />
);

export const ParkAndRideItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={parkAndRideItinerary} />
);

export const BikeRentalTransitItinerary = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={bikeRentalTransitBikeRentalItinerary}
  />
);

export const EScooterRentalTransitItinerary = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={eScooterRentalTransiteScooterRentalItinerary}
  />
);

export const TncTransitItinerary = () => (
  <ItineraryBodyDefaultsWrapper itinerary={tncTransitTncItinerary} />
);
export const IndividualLegFareComponents = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={fareComponentsItinerary}
    showRouteFares
  />
);

export const CustomAlertIconsItinerary = () => (
  <ItineraryBodyDefaultsWrapper
    itinerary={walkTransitWalkItinerary}
    AlertToggleIcon={styled(Bolt).attrs({ size: 15 })``}
    AlertBodyIcon={styled(Bomb).attrs({ size: 18 })``}
  />
);
