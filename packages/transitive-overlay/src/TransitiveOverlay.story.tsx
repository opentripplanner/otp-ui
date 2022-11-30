import EndpointsOverlay from "@opentripplanner/endpoints-overlay";
import React from "react";
import { action } from "@storybook/addon-actions";
import { injectIntl } from "react-intl";

import { withMap } from "../../../.storybook/base-map-wrapper";
import TransitiveOverlay, { itineraryToTransitive } from ".";

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
const otp2ScooterItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/otp2-scooter.json");

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

export default {
  title: "TransitiveOverlay",
  decorators: [withMap()],
  component: TransitiveOverlay
};

export const Empty = (): JSX.Element => (
  <TransitiveOverlay transitiveData={null} visible />
);

export const WalkingItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkOnlyItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkOnlyItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(walkOnlyItinerary, {
        companies
      })}
      visible
    />
  </>
);
WalkingItinerary.decorators = [withMap([45.518841, -122.679302], 19)];

export const BikeOnlyItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(bikeOnlyItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(bikeOnlyItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(bikeOnlyItinerary, { companies })}
      visible
    />
  </>
);
BikeOnlyItinerary.decorators = [withMap([45.520441, -122.68302], 16)];

export const WalkTransitWalkItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkTransitWalkItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkTransitWalkItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(walkTransitWalkItinerary, {
        companies
      })}
      visible
    />
  </>
);
WalkTransitWalkItinerary.decorators = [withMap([45.520441, -122.68302], 16)];

export const WalkTransitWalkItineraryWithNoIntermediateStops = (): JSX.Element => (
  <>
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
        { companies }
      )}
      visible
    />
  </>
);
WalkTransitWalkItineraryWithNoIntermediateStops.decorators = [
  withMap([45.525841, -122.649302], 13)
];

export const BikeTransitBikeItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(bikeTransitBikeItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(bikeTransitBikeItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(bikeTransitBikeItinerary, {
        companies
      })}
      visible
    />
  </>
);
BikeTransitBikeItinerary.decorators = [withMap([45.520441, -122.68302], 16)];

export const WalkInterlinedTransitItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkInterlinedTransitItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkInterlinedTransitItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(walkInterlinedTransitItinerary, {
        companies
      })}
      visible
    />
  </>
);
WalkInterlinedTransitItinerary.decorators = [
  withMap([47.703022, -122.328041], 12.5)
];

export const WalkTransitTransferItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(walkTransitWalkTransitWalkItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(walkTransitWalkTransitWalkItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        walkTransitWalkTransitWalkItinerary,
        { companies }
      )}
      visible
    />
  </>
);
WalkTransitTransferItinerary.decorators = [
  withMap([45.505841, -122.631302], 14)
];

export const BikeRentalItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(bikeRentalItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(bikeRentalItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(bikeRentalItinerary, { companies })}
      visible
    />
  </>
);
BikeRentalItinerary.decorators = [withMap([45.508841, -122.631302], 14)];

export const EScooterRentalItinerary = injectIntl(({ intl }) => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(eScooterRentalItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(eScooterRentalItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(eScooterRentalItinerary, {
        companies,
        intl
      })}
      visible
    />
  </>
));
EScooterRentalItinerary.decorators = [withMap([45.52041, -122.675302], 16)];

export const ParkAndRideItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(parkAndRideItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(parkAndRideItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(parkAndRideItinerary, {
        companies
      })}
      visible
    />
  </>
);
ParkAndRideItinerary.decorators = [withMap([45.515841, -122.75302], 13)];

export const BikeRentalTransitItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(bikeRentalTransitBikeRentalItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(bikeRentalTransitBikeRentalItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(
        bikeRentalTransitBikeRentalItinerary,
        { companies }
      )}
      visible
    />
  </>
);
BikeRentalTransitItinerary.decorators = [withMap([45.538841, -122.6302], 12)];

export const EScooterRentalTransitItinerary = injectIntl(({ intl }) => (
  <>
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
        { companies, intl }
      )}
      visible
    />
  </>
));
EScooterRentalTransitItinerary.decorators = [
  withMap([45.538841, -122.6302], 12)
];

export const TncTransitItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(tncTransitTncItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(tncTransitTncItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(tncTransitTncItinerary, {
        companies
      })}
      visible
    />
  </>
);
TncTransitItinerary.decorators = [withMap([45.538841, -122.6302], 12)];

export const FlexItinerary = (): JSX.Element => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(flexItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(flexItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(flexItinerary, { companies })}
      visible
    />
  </>
);
FlexItinerary.decorators = [withMap([40.038487, -105.0529011], 11)];

export const OTP2ScooterItinerary = injectIntl(({ intl }) => (
  <>
    <EndpointsOverlay
      fromLocation={getFromLocation(otp2ScooterItinerary)}
      setLocation={setLocation}
      toLocation={getToLocation(otp2ScooterItinerary)}
      visible
    />
    <TransitiveOverlay
      transitiveData={itineraryToTransitive(otp2ScooterItinerary, {
        companies,
        intl
      })}
      visible
    />
  </>
));
OTP2ScooterItinerary.decorators = [withMap([33.749, -84.388], 11)];
