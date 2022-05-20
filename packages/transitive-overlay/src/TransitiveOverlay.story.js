import BaseMap from "@opentripplanner/base-map";
import coreUtils from "@opentripplanner/core-utils";
import EndpointsOverlay from "@opentripplanner/endpoints-overlay";
import React from "react";
import { action } from "@storybook/addon-actions";

import TransitiveOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

// Use the font-family defined by storybook <body> element,
// so we don't need to install/import extra fonts.
const storybookFonts =
  '"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';

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
const walkTransitWalkItineraryNoIntermediateStops = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-no-intermediate-stops.json");
const walkTransitWalkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const flexItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/flex-itinerary.json");

const { itineraryToTransitive } = coreUtils.map;
const companies = [
  {
    id: "RAZOR",
    label: "Razor",
    modes: "SCOOTER"
  },
  {
    id: "SHARED",
    label: "Shared",
    modes: "MICROMOBILITY_RENT"
  }
];

const setLocation = action("setLocation");

function getFromLocation(itinerary) {
  return itinerary.legs[0].from;
}

function getToLocation(itinerary) {
  return itinerary.legs[itinerary.legs.length - 1].to;
}

/**
 * Example of a custom route label provider to pass to @opentripplanner/core-utils/map#itineraryToTransitive.
 * @param {*} itineraryLeg The OTP itinerary leg for which to obtain a custom route label.
 * @returns A string with the custom label to display for the given leg.
 */
function getCustomRouteLabel(itineraryLeg) {
  if (itineraryLeg.mode === "TRAM") return "MAX";
  if (itineraryLeg.mode === "RAIL") return "WES";
  if (itineraryLeg.mode === "BUS") return itineraryLeg.routeShortName;
  return null; // null or undefined or empty string will tell transitive-js not to render a route label
}

export default {
  title: "TransitiveOverlay",
  component: TransitiveOverlay
};

export const WalkingItinerary = () => (
  <BaseMap center={[45.518841, -122.679302]} zoom={19}>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkOnlyItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkOnlyItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(walkOnlyItinerary, companies)}
      visible
    />
  </BaseMap>
);

export const BikeOnlyItinerary = () => (
  <BaseMap center={[45.520441, -122.68302]} zoom={16}>
    <EndpointsOverlay
      fromLocation={getFromLocation(bikeOnlyItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(bikeOnlyItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(bikeOnlyItinerary, companies)}
      visible
    />
  </BaseMap>
);

export const WalkTransitWalkItinerary = () => (
  <BaseMap center={[45.520441, -122.68302]} zoom={16}>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkTransitWalkItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkTransitWalkItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        walkTransitWalkItinerary,
        companies
      )}
      visible
    />
  </BaseMap>
);

export const WalkTransitWalkItineraryWithNoIntermediateStops = () => (
  <BaseMap center={[45.525841, -122.649302]} zoom={13}>
    <EndpointsOverlay
      fromLocation={getFromLocation(
        walkTransitWalkItineraryNoIntermediateStops
      )}
      setLocation={setLocation}
      toLocation={getToLocation(walkTransitWalkItineraryNoIntermediateStops)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        walkTransitWalkItineraryNoIntermediateStops,
        companies
      )}
      visible
    />
  </BaseMap>
);

export const BikeTransitBikeItinerary = () => (
  <BaseMap center={[45.520441, -122.68302]} zoom={16}>
    <EndpointsOverlay
      fromLocation={getFromLocation(bikeTransitBikeItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(bikeTransitBikeItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        bikeTransitBikeItinerary,
        companies
      )}
      visible
    />
  </BaseMap>
);

export const WalkInterlinedTransitItinerary = () => (
  <BaseMap center={[45.511841, -122.679302]} zoom={14}>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkInterlinedTransitItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkInterlinedTransitItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        walkInterlinedTransitItinerary,
        companies
      )}
      visible
    />
  </BaseMap>
);

export const WalkTransitTransferItinerary = () => (
  <BaseMap center={[45.505841, -122.631302]} zoom={14}>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkTransitWalkTransitWalkItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkTransitWalkTransitWalkItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        walkTransitWalkTransitWalkItinerary,
        companies
      )}
      visible
    />
  </BaseMap>
);

export const BikeRentalItinerary = () => (
  <BaseMap center={[45.508841, -122.631302]} zoom={14}>
    <EndpointsOverlay
      fromLocation={getFromLocation(bikeRentalItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(bikeRentalItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(bikeRentalItinerary, companies)}
      visible
    />
  </BaseMap>
);

export const EScooterRentalItinerary = () => (
  <BaseMap center={[45.52041, -122.675302]} zoom={16}>
    <EndpointsOverlay
      fromLocation={getFromLocation(eScooterRentalItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(eScooterRentalItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(eScooterRentalItinerary, companies)}
      visible
    />
  </BaseMap>
);

export const ParkAndRideItinerary = () => (
  <BaseMap center={[45.515841, -122.75302]} zoom={13}>
    <EndpointsOverlay
      fromLocation={getFromLocation(parkAndRideItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(parkAndRideItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(parkAndRideItinerary, companies)}
      visible
    />
  </BaseMap>
);

export const BikeRentalTransitItinerary = () => (
  <BaseMap center={[45.538841, -122.6302]} zoom={12}>
    <EndpointsOverlay
      fromLocation={getFromLocation(bikeRentalTransitBikeRentalItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(bikeRentalTransitBikeRentalItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        bikeRentalTransitBikeRentalItinerary,
        companies
      )}
      visible
    />
  </BaseMap>
);

export const EScooterRentalTransitItinerary = () => (
  <BaseMap center={[45.538841, -122.6302]} zoom={12}>
    <EndpointsOverlay
      fromLocation={getFromLocation(
        eScooterRentalTransiteScooterRentalItinerary
      )}
      setLocation={setLocation}
      toLocation={getToLocation(eScooterRentalTransiteScooterRentalItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        eScooterRentalTransiteScooterRentalItinerary,
        companies
      )}
      visible
    />
  </BaseMap>
);

export const TncTransitItinerary = () => (
  <BaseMap center={[45.538841, -122.6302]} zoom={12}>
    <EndpointsOverlay
      fromLocation={getFromLocation(tncTransitTncItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(tncTransitTncItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(tncTransitTncItinerary, companies)}
      visible
    />
  </BaseMap>
);

export const WalkTransitWalkItineraryAndCustomLabelStyles = () => (
  <BaseMap center={[45.520441, -122.68302]} zoom={16}>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkTransitWalkItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkTransitWalkItinerary)}
      visible
    />
    <TransitiveOverlay
      labeledModes={["TRAM"]}
      styles={{
        labels: {
          "font-size": "14px",
          "font-family": storybookFonts
        },
        segment_labels: {
          "border-color": "#FFFFFF",
          "border-radius": 6,
          "border-width": 2,
          color: "#FFE0D0",
          "font-family": storybookFonts,
          "font-size": "18px"
        }
      }}
      transitiveData={itineraryToTransitive(
        walkTransitWalkItinerary,
        companies,
        getCustomRouteLabel
      )}
      visible
    />
  </BaseMap>
);
export const FlexItinerary = () => (
  <BaseMap center={[33.749, -84.388]} zoom={11}>
    <EndpointsOverlay
      fromLocation={getFromLocation(flexItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(flexItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(flexItinerary, companies)}
      visible
    />
  </BaseMap>
);
