import BaseMap from "@opentripplanner/base-map";
import { itineraryToTransitive } from "@opentripplanner/core-utils/lib/map";
import React from "react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import TransitiveOverlay from ".";

import "@opentripplanner/base-map/assets/map.css";

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

const companies = [
  {
    id: "RAZOR",
    label: "Razor",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "SHARED",
    label: "Shared",
    modes: "MICROMOBILITY_RENT"
  }
];

storiesOf("TransitiveOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("TransitiveOverlay with walking itinerary", () => (
    <BaseMap center={[45.518841, -122.679302]} zoom={19}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(walkOnlyItinerary, companies)}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with bike-only itinerary", () => (
    <BaseMap center={[45.520441, -122.68302]} zoom={16}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(bikeOnlyItinerary, companies)}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with walk-transit-walk itinerary", () => (
    <BaseMap center={[45.520441, -122.68302]} zoom={16}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          walkTransitWalkItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with bike-transit-bike itinerary", () => (
    <BaseMap center={[45.520441, -122.68302]} zoom={16}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          bikeTransitBikeItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with walk-interlined-transit itinerary", () => (
    <BaseMap center={[45.511841, -122.679302]} zoom={14}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          walkInterlinedTransitItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with walk-transit-transfer itinerary", () => (
    <BaseMap center={[45.505841, -122.631302]} zoom={14}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          walkTransitWalkTransitWalkItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with bike-rental itinerary", () => (
    <BaseMap center={[45.508841, -122.631302]} zoom={14}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(bikeRentalItinerary, companies)}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with E-scooter-rental itinerary", () => (
    <BaseMap center={[45.52041, -122.675302]} zoom={16}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          eScooterRentalItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with park and ride itinerary", () => (
    <BaseMap center={[45.515841, -122.75302]} zoom={13}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(parkAndRideItinerary, companies)}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with bike rental + transit itinerary", () => (
    <BaseMap center={[45.538841, -122.6302]} zoom={12}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          bikeRentalTransitBikeRentalItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with E-scooter rental + transit itinerary", () => (
    <BaseMap center={[45.538841, -122.6302]} zoom={12}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          eScooterRentalTransiteScooterRentalItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with TNC + transit itinerary", () => (
    <BaseMap center={[45.538841, -122.6302]} zoom={12}>
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          tncTransitTncItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ));
