/**
 * This file contains type definitions for types
 * used across more than one package in this repo.
 */

import React, { FunctionComponent, ReactElement } from "react";

type ZeroOrOne = 0 | 1;

/**
 * Shape for a transportation company.
 */
export type Company = {
  id: string;
  label: string;
  /** a comma-separated string listing the modes that this company has */
  modes: string;
  /**
   * tells OTP UI to ignore the API provided station names
   * and instead use generic ones.
   */
  overridePlaceNames?: boolean;
};

/**
 * Describes some options to help display data about a transit agency that is
 * configured in an opentripplanner instance.
 */
export type TransitOperator = {
  agencyId: string;
  defaultRouteColor?: string;
  defaultRouteTextColor?: string;
  feedId: string;
  logo?: string;
  longNameSplitter?: string;
  name?: string;
  order?: number;
};

/**
 * Describes a map entity to be rendered.
 */
export type LayerEntity = {
  id: string;
  lat: number;
  lon: number;
};

export type SymbolComponentBaseProps = {
  entity: LayerEntity;
  zoom: number;
};

/**
 * The symbol-representing component to draw; with the signature
 * ({ entity: object; zoom: number }) => Element
 * where entity must have an id attribute and contain coordinates information for placement on the map.
 */
export type SymbolComponent = React.ComponentType<SymbolComponentBaseProps>;

/**
 * Defines which symbol to render based on a zoom level; and optionally by entity type.
 * (Only one symbol is rendered for any zoom level.)
 */
export type ZoomBasedSymbol = {
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
};

/**
 * Describes the objects from the real-time vehicle service.
 */
export type TransitVehicle = {
  routeShortName?: string;
  routeLongName?: string;
  routeType?: string;
  routeColor?: string;

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
};

export type OTPTransitVehicle = TransitVehicle & {
  label?: string;
  nextStopName?: string;
  speed?: number;
  stopStatus?: string; // TODO: Make enum
};

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
export type Config = {
  companies?: Company[];
  dateTime: {
    timeFormat?: string;
    dateFormat?: string;
    /** @deprecated */
    longDateFormat?: string;
  };
  homeTimezone: string;
  outputMetricUnits: boolean;
  modes: ConfiguredModes;
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
};

type FeedScopedId = {
  agencyId?: string;
  id?: string;
};

export type EncodedPolyline = {
  length: number;
  points: string;
};

export type ElevationData = {
  first: number;
  second: number;
}[];

export type Alert = {
  alertHeaderText?: string;
  alertDescriptionText?: string;
  alertUrl?: string;
  effectiveStartDate?: number;
};

/**
 * Represents steps in a leg in an itinerary of an OTP plan response. These are
 * only for non-transit modes.
 * See documentation here: http://otp-docs.ibi-transit.com/api/json_WalkStep.html
 */
export type Step = {
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
};

/**
 * Describe an origin, destination, or intermediate location in an itinerary.
 */
export type Place = {
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
};

/**
 * Holds contact info and lead time for flex transit bookings.
 * The information is optional and is for reminding the end-user
 * of any advance reservations required prior to travel.
 */
export type FlexBookingInfo = {
  contactInfo?: {
    phoneNumber: string;
  };
  latestBookingTime?: {
    daysPrior: number;
  };
  message?: string;
};

/** Dropoff-specific flex booking information */
type FlexDropOffBookingInfo = {
  dropOffMessage?: string;
} & FlexBookingInfo;

/** Pickup-specific flex booking information */
type FlexPickupBookingInfo = {
  pickupMessage?: string;
} & FlexBookingInfo;

/**
 * Represents a leg in an itinerary of an OTP plan response. Each leg represents
 * a portion of the overall itinerary that is done until either reaching the
 * destination or transitioning to another mode of travel. See OTP webservice
 * documentation here:
 * http://otp-docs.ibi-transit.com/api/json_Leg.html
 */
export type Leg = {
  accessibilityScore?: number;
  agencyBrandingUrl?: string;
  agencyId?: string;
  agencyName?: string;
  agencyTimeZoneOffset: number;
  agencyUrl?: string;
  alerts?: Alert[];
  boardRule?: string;
  alightRule?: string;
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
  routeTextColor?: string;
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
};

/**
 * Describes the cost of an itinerary leg.
 */
export type Money = {
  cents: number;
  currency: {
    defaultFractionDigits: number;
    currencyCode: string;
    symbol: string;
    currency: string;
  };
};

/**
 * Describes a fare id or route to which a fare applies.
 */
type ApplicableId = string | FeedScopedId;

export type FareDetail = {
  fareId?: ApplicableId;
  isTransfer?: boolean;
  legIndex?: number;
  price: Money;
  routes?: ApplicableId[];
};

export type FareDetails = Record<string, FareDetail[]>;

/**
 * Represents the fare component of an itinerary of an OTP plan response. See
 * detailed documentation in OTP webservice documentation here:
 * http://otp-docs.ibi-transit.com/api/json_Fare.html
 *
 * NOTE: so far the fare includes ONLY a fare encountered on public transit and
 * not any bike rental or TNC rental fees.
 */
export type Fare = {
  details?: FareDetails;
  fare?: Record<string, Money>;
};

/**
 * Represents an itinerary of an OTP plan response. See detailed documentation
 * in OTP webservice documentation here:
 * http://otp-docs.ibi-transit.com/api/json_Itinerary.html
 */
export type Itinerary = {
  co2?: number;
  co2VsBaseline?: number;
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
};

/**
 * In many places all we need from the Itinerary is the legs,
 * this type makes all the other types optional except legs.
 */
export type ItineraryOnlyLegsRequired = Partial<Itinerary> &
  Pick<Itinerary, "legs">;

export type ElevationProfile = {
  maxElev: number;
  minElev: number;
  points: number[];
  traversed: number;
  gain: number;
  loss: number;
};

/**
 * Used to model a location that is used in planning a trip.
 */
export type Location = {
  lat: number;
  lon: number;
  name?: string;
  /**
   * This is only used location that a user has saved. Can be either:
   * One of: 'home', 'work', 'stop' or 'recent'
   */
  type?: "home" | "work" | "stop" | "recent" | string;
  category?: string;

  /**
   * This represents the last time that this location was selected in a
   * search
   */
  timestamp?: number;

  /* Sometimes used for displaying subinfo */
  main?: string;
  secondary?: string;
};

/**
 * Alias for a commonly used basic type
 */
export type LatLngArray = [number, number];

/**
 * Describes a transit stop entity to be rendered on the map.
 */
export type StopLayerStop = LayerEntity & {
  name: string;
};

/**
 * This models data about a stop and it's associated routes that is obtained
 * from a transit index API.
 */
export type Stop = {
  /**
   * The stop code if the stop has one
   */
  code?: string;
  color?: string;
  dist?: number;
  geometries?: { geoJson?: GeoJSON.Polygon };
  id: string;
  lat: number;
  lon: number;
  name: string;
  routes?: Route[];
};

export type Agency = {
  id: string;
  name?: string;
  url?: string;
  timezone?: string;
  lang?: string;
  phone?: string;
  fareUrl?: string;
};
export type Route = {
  agency: Agency;
  agencyId?: string | number;
  agencyName?: string | number;
  shortName: string;
  longName?: string;
  mode?: string;
  id: string;
  // TS TODO: route type enum
  type?: number;
  color?: string;
  textColor?: string;
  routeBikesAllowed?: ZeroOrOne;
  bikesAllowed?: ZeroOrOne;
  sortOrder: number;
  eligibilityRestricted?: ZeroOrOne;
  sortOrderSet: boolean;
};

export type TransitivePlace = {
  place_lat?: number;
  place_lon?: number;
  place_name?: string;
  placeId?: string;
  type: string;
};
export type TransitiveJourney = {
  journey_id: string;
  journey_name: string;
  segments: {
    arc?: boolean;
    from: TransitivePlace;
    patterns?: {
      pattern_id: string;
      from_stop_index: number;
      to_stop_index: number;
    }[];
    streetEdges: number[];
    to: TransitivePlace;
    type: string;
  }[];
};
export type TransitivePattern = {
  pattern_id: string;
  pattern_name: string;
  route_id: string;
  stops: {
    geometry?: string;
    stop_id: string;
  }[];
};
export type TransitiveRoute = {
  agency_id: string;
  route_color?: string;
  route_id: string;
  route_long_name: string;
  route_short_name: string;
  route_text_color?: string;
  route_type: number;
};
export type TransitiveStop = {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
};

export type TransitiveStreetEdge = {
  edge_id: number;
  geometry: EncodedPolyline;
};

export type TransitiveData = {
  journeys: TransitiveJourney[];
  patterns: TransitivePattern[];
  places: TransitivePlace[];
  routes: TransitiveRoute[];
  stops: TransitiveStop[];
  streetEdges: TransitiveStreetEdge[];
};

export type Station = {
  bikesAvailable?: number;
  id: string;
  isFloatingBike?: boolean;
  isFloatingCar?: boolean;
  isFloatingVehicle?: boolean;
  name?: string;
  networks: string[];
  spacesAvailable?: number;
  // TS TODO coordinate type
  x: number;
  y: number;
};

export type ModeOption = {
  id: string;
  selected?: boolean;
  showTitle?: boolean;
  text: JSX.Element;
  title?: string;
};

export type ModeSelectorOptions = {
  primary: ModeOption;
  secondary?: ModeOption[];
  tertiary?: ModeOption[];
};

export type ConfiguredMode =
  | string
  | {
      mode: string;
      label: string;
      company?: string;
    };

export type ConfiguredModes = {
  transitModes: ConfiguredMode[];
  accessModes: ConfiguredMode[];
  exlcusiveModes: ConfiguredMode[];
  bicycleModes: ConfiguredMode[];
  micromobilityModes: ConfiguredMode[];
};

export type ConfiguredCompany = {
  /**
   * The id of the company. This is typically in all-caps.
   */
  id: string;
  /**
   * A human readable text value that can be displayed to users.
   */
  label: string;
  /**
   * A comma-separated list of applicable modes of travel that the company
   * offers.
   */
  modes: string;
};

/**
 * Depending on the geocoder that is used, more properties than just the `label`
 * property might be provided by the geocoder. For example, with the Pelias
 * geocoder, properties such as `id`, `layer`, `source` are also included.
 */
export type GeocodedFeature = {
  geometry: {
    coordinates: LatLngArray;
    type: string;
  };
  properties: {
    label: string;
    layer?: string;
    source?: string;
  };
};

export type TncFare = {
  currencyCode: string;
  maxTNCFare: number;
  minTNCFare: number;
};

export type UserPosition = {
  coords?: {
    latitude: number;
    longitude: number;
  };
  error?: { message: string } | string;
  fetching?: boolean;
};

/**
 * Describes a user location such as "home", "work" etc.
 */
export interface UserLocation extends Location {
  icon?: string;
  id?: string;
}

/**
 * Associates a location with a type string.
 */
export interface UserLocationAndType {
  location: UserLocation;
  type: string;
}

/**
 * Parameters for "clear location" event handlers.
 */
export interface ClearLocationArg {
  locationType: string;
}

/**
 * Parameters for location actions/event handlers.
 */
export interface MapLocationActionArg {
  location: UserLocation;
  locationType: string;
  reverseGeocode?: boolean;
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

/**
 * Options for units of mass (used in CO2 calculation config)
 */
export type MassUnitOption = "ounce" | "kilogram" | "pound" | "gram";
