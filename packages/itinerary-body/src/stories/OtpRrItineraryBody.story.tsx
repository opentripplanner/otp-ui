import { convertGraphQLResponseToLegacy } from "@opentripplanner/core-utils/lib/itinerary";
import { FareProductSelector, Itinerary } from "@opentripplanner/types";
import React, { FunctionComponent, ReactElement } from "react";

import { Meta } from "@storybook/react";
import ItineraryBody from "..";
import {
  CustomTimeColumnContent,
  WrappedOtpRRTransitLegSubheader
} from "../demos";
import OtpRRLineColumnContent from "../otp-react-redux/line-column-content";
import { PlaceName as OtpRRPlaceName } from "../otp-react-redux";
import OtpRRRouteDescription from "../otp-react-redux/route-description";
import { isTestRunner } from "../../../../.storybook/react-intl";
import { TimeColumnContentProps } from "../types";

import ItineraryBodyDefaultsWrapper from "./itinerary-body-defaults-wrapper";
import LegIconWithA11y from "./LegIconWithA11y";

// import mock itinaries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("../__mocks__/itineraries/bike-only.json");
const bikeRentalItinerary = require("../__mocks__/itineraries/bike-rental.json");
const bikeRentalTransitBikeRentalItinerary = require("../__mocks__/itineraries/bike-rental-transit-bike-rental.json");
const bikeTransitBikeItinerary = require("../__mocks__/itineraries/bike-transit-bike.json");
const eScooterRentalItinerary = require("../__mocks__/itineraries/e-scooter-rental.json");
const eScooterRentalTransiteScooterRentalItinerary = require("../__mocks__/itineraries/e-scooter-transit-e-scooter.json");
const fareProductsItinerary = require("../__mocks__/itineraries/leg-fare-products.json");
const parkAndRideItinerary = require("../__mocks__/itineraries/park-and-ride.json");
const tncTransitTncItinerary = require("../__mocks__/itineraries/tnc-transit-tnc.json");
const walkInterlinedTransitItinerary = require("../__mocks__/itineraries/walk-interlined-transit-walk.json");
const walkOnlyItinerary = require("../__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("../__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkTransitWalkItinerary = require("../__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const walkTransitWalkTransitWalkA11yItinerary = require("../__mocks__/itineraries/walk-transit-walk-transit-walk-with-accessibility-scores.json");
const stayOnBoardItinerary = require("../__mocks__/itineraries/stay-on-board.json");
const otp2ScooterItinerary = require("../__mocks__/itineraries/otp2-scooter.json");
const flexItinerary = require("../__mocks__/itineraries/flex-itinerary.json");
const otp24Itinerary = require("../__mocks__/itineraries/otp2.4-transit-itinerary.json");
const transferLegItinerary = require("../__mocks__/itineraries/otp2-transfer-leg.json");

function withLegacyLegs(itinerary) {
  return {
    ...itinerary,
    legs: itinerary.legs.map(convertGraphQLResponseToLegacy)
  };
}

if (!isTestRunner()) {
  // Generate same-day/next day alerts at a fixed time for the walk-transit-walk itinerary
  // for illustration outside of the CI environment.
  const alerts = walkTransitWalkItinerary.legs[1].alerts;
  const todayWithTime = new Date();
  todayWithTime.setUTCHours(14, 48, 25);
  const now = todayWithTime.valueOf();
  alerts[0].effectiveStartDate = now; // Today
  alerts[1].effectiveStartDate = now - 24 * 3600000; // Yesterday
  alerts[2].effectiveStartDate = now + 24 * 3600000; // Tomorrow
}

interface StoryWrapperProps {
  alwaysCollapseAlerts?: boolean;
  defaultFareSelector?: FareProductSelector;
  hideDrivingDirections?: boolean;
  itinerary: Itinerary;
  showAlertEffectiveDateTimeText?: boolean;
  showApproximateAccessLegTravelTimes?: boolean;
  TimeColumnContent?: FunctionComponent<TimeColumnContentProps>;
}

function OtpRRItineraryBodyWrapper({
  alwaysCollapseAlerts,
  defaultFareSelector,
  hideDrivingDirections = false,
  itinerary,
  showAlertEffectiveDateTimeText = true,
  showApproximateAccessLegTravelTimes = false,
  TimeColumnContent
}: StoryWrapperProps): ReactElement {
  return (
    <ItineraryBodyDefaultsWrapper
      alwaysCollapseAlerts={alwaysCollapseAlerts}
      defaultFareSelector={defaultFareSelector}
      hideDrivingDirections={hideDrivingDirections}
      itinerary={itinerary}
      LegIcon={LegIconWithA11y}
      LineColumnContent={OtpRRLineColumnContent}
      PlaceName={OtpRRPlaceName}
      RouteDescription={OtpRRRouteDescription}
      showAgencyInfo
      showAlertEffectiveDateTimeText={showAlertEffectiveDateTimeText}
      showApproximateAccessLegTravelTimes={showApproximateAccessLegTravelTimes}
      showLegIcon
      showMapButtonColumn={false}
      showViewTripButton
      styledItinerary="otp-rr"
      TimeColumnContent={TimeColumnContent}
      TransitLegSubheader={WrappedOtpRRTransitLegSubheader}
    />
  );
}

export default {
  title: "ItineraryBody/otp-react-redux",
  component: ItineraryBody,
  parameters: {
    // date: new Date("March 10, 2021 10:00:00"),
    a11y: { config: { rules: [{ id: "link-in-text-block", enabled: false }] } }
  }
} as Meta;

export const WalkOnlyItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={walkOnlyItinerary} />
);

// OTP2.4 type data
export const Otp24Itinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={otp24Itinerary} />
);

export const BikeOnlyItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={bikeOnlyItinerary} />
);

export const WalkTransitWalkItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={walkTransitWalkItinerary} />
);

export const BikeTransitBikeItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={bikeTransitBikeItinerary} />
);

export const WalkInterlinedTransitItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={walkInterlinedTransitItinerary} />
);

export const WalkTransitTransferItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={walkTransitWalkTransitWalkItinerary} />
);

export const WalkTransitTransferWithA11yItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    itinerary={walkTransitWalkTransitWalkA11yItinerary}
  />
);

export const StayOnBoardItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={withLegacyLegs(stayOnBoardItinerary)} />
);

export const BikeRentalItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={bikeRentalItinerary} />
);

export const EScooterRentalItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={eScooterRentalItinerary} />
);

export const ParkAndRideItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={parkAndRideItinerary} />
);

export const BikeRentalTransitItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={bikeRentalTransitBikeRentalItinerary} />
);

export const EScooterRentalTransitItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    itinerary={eScooterRentalTransiteScooterRentalItinerary}
  />
);

export const TncTransitItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    itinerary={withLegacyLegs(tncTransitTncItinerary)}
  />
);

export const OTP2ScooterItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={otp2ScooterItinerary} />
);

export const OTP2FlexItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={flexItinerary} />
);

export const IndividualLegFareComponents = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    defaultFareSelector={{
      mediumId: "orca:cash",
      riderCategoryId: "orca:regular"
    }}
    itinerary={withLegacyLegs(fareProductsItinerary)}
  />
);

export const CustomTimeColumn = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    itinerary={tncTransitTncItinerary}
    TimeColumnContent={CustomTimeColumnContent}
  />
);

export const ThreeAlertsAlwaysCollapsing = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    alwaysCollapseAlerts
    itinerary={walkTransitWalkItinerary}
  />
);

export const TwoAlertsAlwaysCollapsing = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    alwaysCollapseAlerts
    itinerary={parkAndRideItinerary}
  />
);

export const ZeroAlertsAlwaysCollapsing = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    alwaysCollapseAlerts
    itinerary={walkInterlinedTransitItinerary}
  />
);

export const ThreeAlertsNotAlwaysCollapsing = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    alwaysCollapseAlerts={false}
    itinerary={walkTransitWalkItinerary}
  />
);

export const TwoAlertsNotAlwaysCollapsing = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    alwaysCollapseAlerts={false}
    itinerary={parkAndRideItinerary}
  />
);

export const ZeroAlertsNotAlwaysCollapsing = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    alwaysCollapseAlerts={false}
    itinerary={walkInterlinedTransitItinerary}
  />
);

export const ThreeAlertsWithoutCollapsingProp = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={walkTransitWalkItinerary} />
);

export const TwoAlertsWithoutCollapsingProp = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={parkAndRideItinerary} />
);

export const ZeroAlertsWithoutCollapsingProp = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={walkInterlinedTransitItinerary} />
);

export const HideDrivingDirections = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    hideDrivingDirections
    itinerary={parkAndRideItinerary}
  />
);

export const ApproximatePrefixItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    itinerary={walkTransitWalkItinerary}
    showApproximateAccessLegTravelTimes
  />
);

export const TransferLegItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper itinerary={transferLegItinerary} />
);

export const AlertNoEffectiveAsOfItinerary = (): ReactElement => (
  <OtpRRItineraryBodyWrapper
    itinerary={walkTransitWalkItinerary}
    showAlertEffectiveDateTimeText={false}
  />
);
