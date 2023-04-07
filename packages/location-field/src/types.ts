import { Location, Stop, UserLocation, UserPosition } from "@opentripplanner/types";
import React from "react";
// eslint-disable-next-line prettier/prettier
import type { IntlShape } from "react-intl";

export type LocationType = "from" | "to" | `intermediate-place-${number}`;
export type ResultType =
  | "CURRENT_LOCATION"
  | "GEOCODE"
  | "SAVED"
  | "SESSION"
  | "STOP";

export interface LocationSelectedEvent {
  locationType: LocationType;
  location: Location;
  resultType: ResultType;
}

export interface LocationFieldProps {
  /**
   * Dispatched upon selecting a geocoded result
   * Provides an argument in the format:
   * ```js
   * { location: geocodedLocation }
   * ```
   */
  addLocationSearch?: ({ location: GeocodedLocation }) => void;
  /**
   * Determines whether the input field of this component should auto-focus on first display.
   */
  autoFocus?: boolean;
  /**
   * Used for additional styling with styled components for example.
   */
  className?: string;
  /** A slot for a component that can be used to display a custom icon for the
   * clear location button.
   */
  clearButtonIcon?: React.ReactNode;
  /**
   * Dispatched whenever the clear location button is clicked.
   * Provides an argument in the format:
   *
   * ```js
   * { locationType: string }
   * ```
   */
  clearLocation?: ({ locationType: LocationType }) => void;
  /**
   * The current position of the user if it is available.
   */
  currentPosition?: UserPosition
  /**
   * A slot for the icon to display for the current position
   */
  currentPositionIcon?: React.ReactNode;
  /**
   * A slot for the icon to display for when the current position is unavailable
   */
  currentPositionUnavailableIcon?: React.ReactNode;
  /**
   * Invoked whenever the currentPosition is set, but the nearbyStops are not.
   * Sends the following argument:
   *
   * ```js
   * {
   *   lat: currentPosition.coords.latitude,
   *   lon: currentPosition.coords.longitude,
   *   max: geocoderConfig.maxNearbyStops || 4
   * }
   * ```
   */
  findNearbyStops?: ({
    lat,
    lon,
    max
  }: {
    lat: number;
    lon: number;
    max: number;
  }) => void;
  /**
   * A slot for a component that can be used to display a custom icon for a
   * geocoded option. This component is passed a single property called
   * `feature` which will be in the geocodedFeatureType shape.
   */
  GeocodedOptionIconComponent?: React.FunctionComponent<{
    feature: {
      properties?: { source: string };
    };
  }>;
  /**
   * A configuration object describing what geocoder should be used.
   */
  geocoderConfig: {
    baseUrl?: string;
    boundary?: {
      // TriMet-specific default
      rect?: {
        minLon?: number;
        maxLon?: number;
        minLat?: number;
        maxLat?: number;
      };
    };
    maxNearbyStops?: number;
    type: string;
  };
  /**
   * This is dispatched when the current position is null. This indicates that
   * the user has requested to use the current position, but that the current
   * position is not currently available. This method sends back the
   * locationType value supplied to the component.
   */
  getCurrentPosition: (intl: IntlShape, locationType: string) => void;
  /**
   * Whether the provided location (if one is provided) should not be shown upon
   * initial render.
   */
  hideExistingValue?: boolean;
  /**
   * Allows the component to be rendered with pre-filled results
   */
  initialSearchResults?: {
    geometry?: {
      type?: string;
      // coordinates?: [number, number];
      coordinates?: number[];
    };
    properties?: { id?: string };
    type?: string;
  }[];
  /**
   * Placeholder text to show in the input element. If the current position is
   * set to have a true fetching property, then the text "Fetching location..."
   * will display. If this value isn't provided, the locationType will be shown.
   */
  inputPlaceholder?: string;
  /**
   * Setting this to true adds properties to the rendered input marking the field as required.
   */
  isRequired?: boolean;
  /**
   * show autocomplete options as fixed/inline element rather than dropdown
   */
  isStatic?: boolean;
  /**
   * Setting this to false adds properties to the rendered input marking the field as invalid.
   */
  isValid?: boolean;
  /**
   * Mapping from Pelias layer to color. Allows results from different
   * Pelias sources to be shown in a different color.
   */
  layerColorMap?: {
    [key: string]: string;
    // Explicitly include those used as headers
    stops?: string;
    stations?: string;
  };
  /**
   * The location that this component is currently set with.
   */
  location?: Location;
  /**
   * A custom component for rendering the icon displayed to the left of the text
   * input. This component is passed a single prop of `locationType`.
   */
  LocationIconComponent?: React.FunctionComponent<{
    locationType: LocationType;
  }>;
  /**
   * Either `from` or `to`, or `intermediate-place-${number}`.
   */
  locationType: LocationType;
  /**
   * A list of stopIds of the stops that should be shown as being nearby. These
   * must be referenceable in the stopsIndex prop.
   */
  nearbyStops?: string[];
  /**
   * A function to handle when a location is selected. This is always dispatched
   * with an object of type LocationSelectedEvent, with the following fields:
   * - locationType is set with the same value as the locationType prop passed to this component.
   * - location:
   *   lat and lon always available.
   *   id is only populated for stops and user-saved locations.
   *   Other attributes vary per location type.
   * - resultType indicates the type of location that was selected:
   *   "CURRENT_LOCATION": The user's current location.
   *   "GEOCODE": A location that was found via a geocode search result
   *   "SAVED": A location that was saved by the user.
   *   "SESSION": A geocoded search result that was recently selected by the user.
   *   "STOP": A transit stop
   */
  onLocationSelected: (e: LocationSelectedEvent) => void;
  /**
   * Invoked whenever the text input is clicked or when the clear button is clicked.
   */
  onTextInputClick?: () => void;
  /**
   * Mapping from Pelias *operator* to icon (represented as jsx). Allows results
   * from different Pelias operators to be given a unique Icon.
   */
  operatorIconMap?: { [key: string]: React.ReactNode };
  /**
   * Results are sorted by distance, but favored layers will always appear first.
   */
  preferredLayers?: string[];
  /**
   * A slot for the icon to display for an option that was used during the
   * current session.
   */
  sessionOptionIcon?: React.ReactNode;
  /**
   * A list of recent searches to show to the user. These are typically only
   * geocode results that a user has previously selected.
   */
  sessionSearches?: Location[];
  /**
   * Whether or not to show the clear button
   */
  showClearButton?: boolean;
  /**
   * Whether or not to show user settings dialog
   */
  showUserSettings?: boolean;
  /**
   * A boolean for whether to override the result sort order and sort by
   * distance.
   */
  sortByDistance?: boolean;
  /**
   * A slot for the icon to display for a stop option
   */
  stopOptionIcon?: React.ReactNode;
  /**
   * An index of stops by StopId
   */
  stopsIndex?: { [key: string]: Stop };
  /**
   * React style object
   */
  style?: React.CSSProperties;
  /**
   * When showing special categories of transit response, these can be capped
   * to prevent the list of responses from getting too long. This value declares
   * how many responses to show in each category
   */
  suggestionCount?: number;
  /**
   * If true, do not show nearbyStops or current location as options
   */
  suppressNearby?: boolean;
  /**
   * A custom component for rendering the icon for options that are either saved
   * user locations or recent places. The component will be sent a single prop
   * of `userLocation` which is a userLocationType.
   */
  UserLocationIconComponent?: React.FunctionComponent<{
    userLocation: UserLocation;
  }>;
  /**
   * An array of recent locations and places a user has searched for.
   */
  userLocationsAndRecentPlaces?: UserLocation[];
}

export interface Properties {
  accuracy: string;
  addendum: {
    osm: {
      operator: string;
    };
  };
  continent_gid: string;
  continent: string;
  country_a: string;
  country_code: string;
  country_gid: string;
  country: string;
  county_a: string;
  county_gid: string;
  county: string;
  distance: number;
  gid: string;
  housenumber: string;
  id: string;
  label: string;
  layer: string;
  locality_gid: string;
  locality: string;
  name: string;
  neighbourhood_gid: string;
  neighbourhood: string;
  postalcode: string;
  region_a: string;
  region_gid: string;
  region: string;
  source_id: string;
  source: string;
  street: string;
}

export interface Label {
  main: string;
  secondary?: string;
}
