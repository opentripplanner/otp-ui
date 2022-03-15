import coreUtils from "@opentripplanner/core-utils";
import { ClassicLegIcon } from "@opentripplanner/icons";
import PropTypes from "prop-types";
import React from "react";

import ItineraryBody from "..";
import {
  CustomTimeColumnContent,
  WrappedOtpRRTransitLegSubheader
} from "../demos";
import ItineraryBodyDefaultsWrapper from "./itinerary-body-defaults-wrapper";
import OtpRRLineColumnContent from "../otp-react-redux/line-column-content";
import { PlaceName as OtpRRPlaceName } from "../otp-react-redux";
import OtpRRRouteDescription from "../otp-react-redux/route-description";

// import mock itinaries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("../__mocks__/itineraries/bike-only.json");
const bikeRentalItinerary = require("../__mocks__/itineraries/bike-rental.json");
const bikeRentalTransitBikeRentalItinerary = require("../__mocks__/itineraries/bike-rental-transit-bike-rental.json");
const bikeTransitBikeItinerary = require("../__mocks__/itineraries/bike-transit-bike.json");
const eScooterRentalItinerary = require("../__mocks__/itineraries/e-scooter-rental.json");
const eScooterRentalTransiteScooterRentalItinerary = require("../__mocks__/itineraries/e-scooter-transit-e-scooter.json");
const fareComponentsItinerary = require("../__mocks__/itineraries/fare-components.json");
const parkAndRideItinerary = require("../__mocks__/itineraries/park-and-ride.json");
const tncTransitTncItinerary = require("../__mocks__/itineraries/tnc-transit-tnc.json");
const walkInterlinedTransitItinerary = require("../__mocks__/itineraries/walk-interlined-transit-walk.json");
const walkOnlyItinerary = require("../__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("../__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkTransitWalkItinerary = require("../__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const walkTransitWalkTransitWalkA11yItinerary = require("../__mocks__/itineraries/walk-transit-walk-transit-walk-with-accessibility-scores.json");

// Generate same-day/next day alerts at a fixed time for the walk-transit-walk itinerary
const alerts = walkTransitWalkItinerary.legs[1].alerts;
const todayWithTime = new Date();
todayWithTime.setUTCHours(14, 48, 25);
const now = todayWithTime.valueOf();
alerts[0].effectiveStartDate = now; // Today
alerts[1].effectiveStartDate = now - 24 * 3600000; // Yesterday
// FIXME: Fix the criterion that decides waht constitutes "tomorrow"
// (Adding 24 hours so that a timestamp occurs next day may not be enough).
alerts[2].effectiveStartDate = now + 36 * 3600000; // Tomorrow

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
  title: "ItineraryBody/otp-react-redux",
  component: ItineraryBody
};

export const WalkOnlyItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={walkOnlyItinerary} />
);

export const BikeOnlyItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={bikeOnlyItinerary} />
);

export const WalkTransitWalkItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={walkTransitWalkItinerary} />
);

export const BikeTransitBikeItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={bikeTransitBikeItinerary} />
);

export const WalkInterlinedTransitItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={walkInterlinedTransitItinerary} />
);

export const WalkTransitTransferItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={walkTransitWalkTransitWalkItinerary} />
);

export const WalkTransitTransferWithA11yItinerary = () => (
  <OtpRRItineraryBodyWrapper
    itinerary={walkTransitWalkTransitWalkA11yItinerary}
  />
);

export const BikeRentalItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={bikeRentalItinerary} />
);

export const EScooterRentalItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={eScooterRentalItinerary} />
);

export const ParkAndRideItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={parkAndRideItinerary} />
);

export const BikeRentalTransitItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={bikeRentalTransitBikeRentalItinerary} />
);

export const EScooterRentalTransitItinerary = () => (
  <OtpRRItineraryBodyWrapper
    itinerary={eScooterRentalTransiteScooterRentalItinerary}
  />
);

export const TncTransitItinerary = () => (
  <OtpRRItineraryBodyWrapper itinerary={tncTransitTncItinerary} />
);

export const IndividualLegFareComponents = () => (
  <OtpRRItineraryBodyWrapper
    itinerary={fareComponentsItinerary}
    showRouteFares
  />
);

export const CustomTimeColumn = () => (
  <OtpRRItineraryBodyWrapper
    itinerary={tncTransitTncItinerary}
    TimeColumnContent={CustomTimeColumnContent}
  />
);
