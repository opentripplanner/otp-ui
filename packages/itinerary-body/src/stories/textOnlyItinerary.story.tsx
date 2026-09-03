import { Meta } from "@storybook/react-vite";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import textOnlyItineraryString from "../textOnlyItinerary/index";

// import mock itinaries. These are all trip plan outputs from OTP.
import bikeOnlyItinerary from "../__mocks__/itineraries/bike-only.json";
import bikeRentalItinerary from "../__mocks__/itineraries/bike-rental.json";
import bikeRentalTransitBikeRentalItinerary from "../__mocks__/itineraries/bike-rental-transit-bike-rental.json";
import bikeTransitBikeItinerary from "../__mocks__/itineraries/bike-transit-bike.json";
import eScooterRentalItinerary from "../__mocks__/itineraries/e-scooter-rental.json";
import eScooterRentalTransiteScooterRentalItinerary from "../__mocks__/itineraries/e-scooter-transit-e-scooter.json";
import legNoStopCodeItinerary from "../__mocks__/itineraries/leg-no-stop-code.json";
import parkAndRideItinerary from "../__mocks__/itineraries/park-and-ride.json";
import tncTransitTncItinerary from "../__mocks__/itineraries/tnc-transit-tnc.json";
import walkInterlinedTransitItinerary from "../__mocks__/itineraries/walk-interlined-transit-walk.json";
import walkOnlyItinerary from "../__mocks__/itineraries/walk-only.json";
import walkTransitWalkItinerary from "../__mocks__/itineraries/walk-transit-walk.json";
import walkTransitWalkTransitWalkItinerary from "../__mocks__/itineraries/walk-transit-walk-transit-walk.json";
import walkTransitWalkTransitWalkA11yItinerary from "../__mocks__/itineraries/walk-transit-walk-transit-walk-with-accessibility-scores.json";
import otp2ScooterItinerary from "../__mocks__/itineraries/otp2-scooter.json";
import flexItinerary from "../__mocks__/itineraries/flex-itinerary.json";
import otp24Itinerary from "../__mocks__/itineraries/otp2.4-transit-itinerary.json";
import transferLegItinerary from "../__mocks__/itineraries/otp2-transfer-leg.json";

const TextItineraryStoryWrapper = ({ itinerary }: { itinerary: any }) => {
  const intl = useIntl();
  const itineraryString = textOnlyItineraryString(intl, itinerary);

  return <div style={{ whiteSpace: "pre-line" }}>{itineraryString}</div>;
};

export default {
  title: "ItineraryBody/text-only-itinerary-string",
  component: TextItineraryStoryWrapper,
  parameters: {
    // date: new Date("March 10, 2021 10:00:00"),
    a11y: { config: { rules: [{ id: "link-in-text-block", enabled: false }] } }
  }
} as Meta;

export const WalkOnlyItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={walkOnlyItinerary} />
);

// OTP2.4 type data
export const Otp24Itinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={otp24Itinerary} />
);

export const BikeOnlyItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={bikeOnlyItinerary} />
);

export const WalkTransitWalkItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={walkTransitWalkItinerary} />
);

export const WalkTransitWalkItineraryMetric = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={walkTransitWalkItinerary} />
);

export const BikeTransitBikeItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={bikeTransitBikeItinerary} />
);

export const WalkInterlinedTransitItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={walkInterlinedTransitItinerary} />
);

export const WalkTransitTransferItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={walkTransitWalkTransitWalkItinerary} />
);

export const WalkTransitTransferWithA11yItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper
    itinerary={walkTransitWalkTransitWalkA11yItinerary}
  />
);

export const BikeRentalItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={bikeRentalItinerary} />
);

export const EScooterRentalItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={eScooterRentalItinerary} />
);

export const ParkAndRideItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={parkAndRideItinerary} />
);

export const BikeRentalTransitItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={bikeRentalTransitBikeRentalItinerary} />
);

export const EScooterRentalTransitItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper
    itinerary={eScooterRentalTransiteScooterRentalItinerary}
  />
);

export const OTP2ScooterItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={otp2ScooterItinerary} />
);

export const OTP2FlexItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={flexItinerary} />
);

export const CustomTimeColumn = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={tncTransitTncItinerary} />
);

export const HideDrivingDirections = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={parkAndRideItinerary} />
);

export const TransferLegItinerary = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={transferLegItinerary} />
);

export const StopWithNoStopCode = (): ReactElement => (
  <TextItineraryStoryWrapper itinerary={legNoStopCodeItinerary} />
);
