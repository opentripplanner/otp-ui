import React from "react";

// import mock itinaries. These are all trip plan outputs from OTP.
import bikeOnlyItinerary from "../../../itinerary-body/src/__mocks__/itineraries/bike-only.json";
import bikeRentalItinerary from "../../../itinerary-body/src/__mocks__/itineraries/bike-rental.json";
import eScooterRentalItinerary from "../../../itinerary-body/src/__mocks__/itineraries/e-scooter-rental.json";
import parkAndRideItinerary from "../../../itinerary-body/src/__mocks__/itineraries/park-and-ride.json";
import tncTransitTncItinerary from "../../../itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json";
import walkOnlyItinerary from "../../../itinerary-body/src/__mocks__/itineraries/walk-only.json";
import walkTransitWalkItinerary from "../../../itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json";
import walkTransitWalkTransitWalkItinerary from "../../../itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json";

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
