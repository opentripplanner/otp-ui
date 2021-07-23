import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import { IntlProvider } from "react-intl";
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

function getCustomMessages(itinerary) {
  const itinDate = new Date(itinerary.startTime);
  const {
    centsToString,
    maxTNCFare,
    minTNCFare,
    transitFare
  } = coreUtils.itinerary.calculateFares(itinerary);
  const companies = itinerary.legs
    .filter(leg => leg.tncData)
    .map(leg => leg.tncData.company);
  const {
    bikeDuration,
    caloriesBurned,
    walkDuration
  } = coreUtils.itinerary.calculatePhysicalActivity(itinerary);

  return {
    caloriesBurned: <>{caloriesBurned} Calories burned</>,
    caloriesBurnedDescription: (
      <>
        The calories description can be constructed using any markup and
        itinerary params like {walkDuration} min walk and {bikeDuration} min
        bike, and including formatting markup from a string localization
        library.
      </>
    ),
    depart: (
      <>
        <b>You depart at</b> <u>{itinDate.toLocaleTimeString()}</u>
        {" on "}
        {itinDate.toISOString()}
      </>
    ),
    departDescription: (
      <>
        The depart message can be constructed dynamically using any markup,
        including formatting markup from a string localization library.
      </>
    ),
    title: "Details about this Trip",
    tncFare: (
      <>
        <u>
          ${minTNCFare}-${maxTNCFare}
        </u>{" "}
        for {companies[0]}
      </>
    ),
    transitFare: (
      <>
        <u>{centsToString(transitFare)}</u> transit ticket
      </>
    ),
    transitFareDescription: (
      <>
        The transit and/or TNC fare message can be constructed dynamically using
        any markup, including formatting markup from a string localization
        library.
      </>
    )
  };
}

const localizedMessages = {
  caloriesBurnedId: "<b>{caloriesBurned, number, ::.} Calories</b> burned",
  caloriesBurnedDescriptionId:
    "Walking <b>{walkDuration}</b> minute(s) and biking <b>{bikeDuration}</b> minute(s) will consume {caloriesBurned} Calories.",
  departId:
    "<b>Leave</b> at <b>{departDate, time, ::hh:mm}</b> on <b>{departDate, date, ::yyyyMMMMdd}</b>",
  departDescriptionId:
    "The depart message can be rendered using the <b>departDate</b> param using a react-intl message id.",
  titleId: "Localized Trip Details",
  tncFareId:
    "Pay <b>{minTNCFare, number, ::.00 currency/EUR}-{maxTNCFare, number, ::.00 currency/EUR}</b> to {companies}",
  transitFareId:
    "<b>{transitFare, number, ::.00 currency/EUR}</b> transit ticket",
  transitFareDescriptionId:
    "The transit and/or TNC fare message can be rendered using a react-intl message id (no params accepted)."
};

const localizedMessageIds = {
  caloriesBurned: "caloriesBurnedId",
  caloriesBurnedDescription: "caloriesBurnedDescriptionId",
  depart: "departId",
  departDescription: "departDescriptionId",
  title: "titleId",
  tncFare: "tncFareId",
  transitFare: "transitFareId",
  transitFareDescription: "transitFareDescriptionId"
};

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

export const WalkTransitWalkItineraryAndCustomMessages = () => {
  return (
    <TripDetails
      itinerary={walkTransitWalkItinerary}
      longDateFormat={longDateFormat}
      messages={getCustomMessages(walkTransitWalkItinerary)}
    />
  );
};

export const WalkTransitWalkItineraryLocalizedAndCustomMessages = () => {
  return (
    <IntlProvider messages={localizedMessages}>
      <TripDetails
        itinerary={walkTransitWalkItinerary}
        localized
        messages={localizedMessageIds}
      />
    </IntlProvider>
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

export const TncTransitItineraryWithCustomMessages = () => (
  <TripDetails
    itinerary={tncTransitTncItinerary}
    longDateFormat={longDateFormat}
    messages={getCustomMessages(tncTransitTncItinerary)}
  />
);

export const TncTransitItineraryLocalizedWithCustomMessages = () => (
  <IntlProvider messages={localizedMessages}>
    <TripDetails
      itinerary={tncTransitTncItinerary}
      localized
      messages={localizedMessageIds}
    />
  </IntlProvider>
);
