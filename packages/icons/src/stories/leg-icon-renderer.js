import React from "react";

import IconRenderer from "./icon-renderer";

// import mock itinaries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-only.json");
const bikeRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental.json");
const eScooterRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-rental.json");
const parkAndRideItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/park-and-ride.json");
const tncTransitTncItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json");
const walkOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");

const exampleLegs = [
  { leg: bikeOnlyItinerary.legs[0], type: "Personal bike" },
  { leg: bikeRentalItinerary.legs[1], type: "Bike rental" },
  { leg: walkTransitWalkTransitWalkItinerary.legs[1], type: "Bus" },
  {
    leg: eScooterRentalItinerary.legs[1],
    type: "Micromobility (from Razor company)"
  },
  { leg: parkAndRideItinerary.legs[0], type: "Park & Ride" },
  { leg: tncTransitTncItinerary.legs[0], type: "TNC (Uber)" },
  { leg: walkTransitWalkItinerary.legs[1], type: "Tram" },
  { leg: walkOnlyItinerary.legs[0], type: "Walk" }
];

export default function LegIconRenderer({ component: Component }) {
  return (
    <IconRenderer
      examples={exampleLegs}
      renderComponentFn={example => <Component leg={example.leg} />}
      typeTitle="Leg Type"
    />
  );
}
