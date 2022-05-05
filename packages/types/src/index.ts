/**
 * This file contains type definitions for types
 * used across more than one package in this repo.
 */

import React, { FunctionComponent, ReactElement } from "react";

/**
 * Shape for a transportation company.
 */
export interface Company {
  id: string;
  label: string;
  /** a comma-separated string listing the modes that this company has */
  modes: string;
}

/**
 * Describes some options to help display data about a transit agency that is
 * configured in an opentripplanner instance.
 */
export interface TransitOperator {
  agencyId: string;
  defaultRouteColor?: string;
  defaultRouteTextColor?: string;
  feedId: string;
  logo?: string;
  longNameSplitter?: string;
  name?: string;
  order?: number;
}

/**
 * Describes a map entity to be rendered.
 */
export interface LayerEntity {
  id: string;
  lat: number;
  lon: number;
}

interface SymbolComponentBaseProps {
  entity: LayerEntity;
  zoom: number;
}

/**
 * The symbol-representing component to draw; with the signature
 * ({ entity: object; zoom: number }) => Element
 * where entity must have an id attribute and contain coordinates information for placement on the map.
 */
type SymbolComponent = React.ComponentType<SymbolComponentBaseProps>;

/**
 * Defines which symbol to render based on a zoom level; and optionally by entity type.
 * (Only one symbol is rendered for any zoom level.)
 */
export interface ZoomBasedSymbol {
  /**
   * A function with the signature (entity: object) => string
   * that determines the type of an entity.
   * symbolByType and getType must be either be both specified or both omitted.
   */
  getType?: (entity: LayerEntity) => string;
  /**
   * The zoom level beginning at which the marker is drawn;
   * unless another marker with a higher minZoom is met.
   */
  minZoom: number;
  /**
   * The symbol-representing component to draw; with the signature
   * ({ entity: object; zoom: number }) => Element
   * where entity must have an id attribute and contain coordinates information for placement on the map.
   */
  symbol: SymbolComponent;
  /**
   * The symbol-representing component to draw for each entity type;
   * with the same signature as symbol. If a type returned by getType() is not listed;
   * then the component defined in the 'symbol' attribute will be rendered by default.
   * symbolByType and getType must be either be both specified or both omitted.
   */
  symbolByType?: {
    [name: string]: SymbolComponent;
  };
}

/**
 * Describes the objects from the real-time vehicle service.
 */
export interface TransitVehicle {
  routeShortName?: string;
  routeLongName?: string;
  routeType?: string;

  status?: string;
  reportDate?: string;
  seconds?: number;

  stopSequence?: number;
  stopId?: string;
  vehicleId?: string;
  tripId?: string;
  blockId?: string;

  lat?: number;
  lon?: number;
  heading?: number;
}

export type VehicleRentalMapOverlaySymbol =
  | {
      dockStrokeColor?: string;
      fillColor?: string;
      minZoom: number;
      pixels?: number;
      type: string;
    }
  | ZoomBasedSymbol;

/**
 * Represents the expected configuration of the webapp.
 *
 * Note: this is an incomplete type mapping.
 */
export interface Config {
  companies?: Company[];
  dateTime: {
    timeFormat?: string;
    dateFormat?: string;
    longDateFormat?: string;
  };
  // TODO: add full typing
  map?: {
    overlays?: {
      /**
       * The applicable companies this overlay covers. Only applicable in
       * certain vehicle rental overlays.
       */
      companies?: string[];
      name: string;
      /**
       * The applicable map symbols. Only applicable in vehicle rental
       * overlays.
       */
      mapSymbols?: VehicleRentalMapOverlaySymbol[];
      /**
       * Only used during park and ride queries. This will filter out P&Rs
       * that are further than the specified number of meters from a transit
       * stop.
       */
      maxTransitDistance?: number;
      /**
       * The applicable modes this overlay covers. Only applicable in certain
       * vehicle rental overlays.
       */
      modes?: string[];
      /**
       * The type of overlay. Currently valid values include:
       *
       * "bike-rental"; "car-rental"; "micromobility-rental"; "park-and-ride";
       * "stops"; "tile"
       */
      type: string;
    }[];
  };
  transitOperators?: TransitOperator[];
}

interface FeedScopedId {
  agencyId?: string;
  id?: string;
}

export interface EncodedPolyline {
  length: number;
  points: string;
}

type ElevationData = {
  first: number;
  second: number;
}[];

export interface Alert {
  alertHeaderText?: string;
  alertDescriptionText?: string;
  alertUrl?: string;
  effectiveStartDate?: number;
}

/**
 * Represents steps in a leg in an itinerary of an OTP plan response. These are
 * only for non-transit modes.
 * See documentation here: http://otp-docs.ibi-transit.com/api/json_WalkStep.html
 */
export interface Step {
  absoluteDirection?: string;
  alerts?: Alert[];
  area: boolean;
  bogusName: boolean;
  distance: number;
  elevation: ElevationData;
  lat: number;
  lon: number;
  relativeDirection: string;
  stayOn: boolean;
  streetName: string;
}

/**
 * Describe an origin, destination, or intermediate location in an itinerary.
 */
export interface Place {
  address?: string;
  arrival?: number;
  bikeShareId?: string;
  departure?: number;
  lat: number;
  lon: number;
  name: string;
  networks?: string[];
  stopCode?: string;
  stopId?: string;
  stopIndex?: number;
  stopSequence?: number;
  vertexType: string;
  zoneId?: string;
}

/**
 * Holds contact info and lead time for flex transit bookings.
 * The information is optional and is for reminding the end-user
 * of any advance reservations required prior to travel.
 */
export interface FlexBookingInfo {
  contactInfo?: {
    phoneNumber: string;
  };
  latestBookingTime?: {
    daysPrior: number;
  };
}

/** Dropoff-specific flex booking information */
interface FlexDropOffBookingInfo extends FlexBookingInfo {
  dropOffMessage?: string;
}

/** Pickup-specific flex booking information */
interface FlexPickupBookingInfo extends FlexBookingInfo {
  pickupMessage?: string;
}

/**
 * Represents a leg in an itinerary of an OTP plan response. Each leg represents
 * a portion of the overall itinerary that is done until either reaching the
 * destination or transitioning to another mode of travel. See OTP webservice
 * documentation here:
 * http://otp-docs.ibi-transit.com/api/json_Leg.html
 */
export interface Leg {
  accessibilityScore?: number;
  agencyBrandingUrl?: string;
  agencyId?: string;
  agencyName?: string;
  agencyTimeZoneOffset: number;
  agencyUrl?: string;
  alerts?: Alert[];
  arrivalDelay: number;
  averageWait?: number;
  departureDelay: number;
  distance: number;
  dropOffBookingInfo?: FlexDropOffBookingInfo;
  duration: number;
  endTime: number;
  from: Place;
  hailedCar: boolean;
  headsign?: string;
  interlineWithPreviousLeg: boolean;
  intermediateStops: Place[];
  interStopGeometry?: EncodedPolyline[];
  legGeometry: EncodedPolyline;
  mode: string;
  pathway: boolean;
  pickupBookingInfo?: FlexPickupBookingInfo;
  realTime: boolean;
  rentedBike: boolean;
  rentedCar: boolean;
  rentedVehicle: boolean;
  route?: string;
  routeColor?: string;
  routeId?: string;
  routeLongName?: string;
  routeShortName?: string;
  routeType?: number;
  serviceDate?: string;
  startTime: number;
  steps: Step[];
  tncData?: {
    company: string;
    currency: string;
    displayName: string;
    estimatedArrival: number;
    maxCost: number;
    minCost: number;
    productId: string;
    travelDuration: number;
  };
  to: Place;
  transitLeg: boolean;
  tripBlockId?: string;
  tripId?: string;
  walkingBike?: boolean;
}

/**
 * Describes the cost of an itinerary leg.
 */
export interface Money {
  cents: number;
  currency: {
    defaultFractionDigits: number;
    currencyCode: string;
    symbol: string;
    currency: string;
  };
}

/**
 * Describes a fare id or route to which a fare applies.
 */
type ApplicableId = string | FeedScopedId;

/**
 * Represents the fare component of an itinerary of an OTP plan response. See
 * detailed documentation in OTP webservice documentation here:
 * http://otp-docs.ibi-transit.com/api/json_Fare.html
 *
 * NOTE: so far the fare includes ONLY a fare encountered on public transit and
 * not any bike rental or TNC rental fees.
 */
export interface Fare {
  details?: {
    [name: string]: {
      fareId?: ApplicableId;
      price: Money;
      legIndex?: number;
      isTransfer?: boolean;
      routes?: ApplicableId[];
    }[];
  };
  fare?: {
    [name: string]: Money;
  };
}

/**
 * Represents an itinerary of an OTP plan response. See detailed documentation
 * in OTP webservice documentation here:
 * http://otp-docs.ibi-transit.com/api/json_Itinerary.html
 */
export interface Itinerary {
  duration: number;
  elevationGained: number;
  elevationLost: number;
  endTime: number;
  fare?: Fare;
  legs: Leg[];
  startTime: number;
  tooSloped?: boolean;
  transfers: number;
  transitTime: number;
  waitingTime: number;
  walkDistance: number;
  walkLimitExceeded: boolean;
  walkTime: number;
}

/**
 * Used to model a location that is used in planning a trip.
 */
export interface Location {
  lat: number;
  lon: number;
  name: string;
  /**
   * This is only used location that a user has saved. Can be either:
   * "home" or "work"
   */
  type?: string;
}

/**
 * Describes a transit stop entity to be rendered on the map.
 */
export interface StopLayerStop extends LayerEntity {
  name: string;
}

/**
 * Describes time options, including time format and timezone-related offset.
 */
export interface TimeOptions {
  format?: string;
  offset?: string;
}

/**
 * Supports leg icons for itinerary body and printable itinerary.
 */
export type LegIconComponent = FunctionComponent<{
  leg: Leg;
  title?: string;
  width?: string;
}>;

/**
 * Supports displaying accessibility ratings as a set of thresholds
 * associated with an icon or text.
 */
export type GradationMap = Record<
  number,
  { color: string; icon?: ReactElement; text?: string }
>;
