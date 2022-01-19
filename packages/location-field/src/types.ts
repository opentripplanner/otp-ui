import React from "react";

export type LocationType = "from" | "to";
export type ResultType =
  | "CURRENT_LOCATION"
  | "GEOCODE"
  | "SAVED"
  | "SESSION"
  | "STOP";
export type Location = {
  id?: string;
  lat?: number;
  lon?: number;
  name?: string;
  main?: string;
  secondary?: string;
};

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
  currentPosition?: {
    coords?: {
      latitude: number;
      longitude: number;
    };
    error?: { message: string };
    fetching?: boolean;
  };
  /**
   * A slot for the icon to display for the current position
   */
  currentPositionIcon?: React.ReactNode;
  /**
   * A slot for the icon to display for when the current position is unavailable
   */
  currentPositionUnavailableIcon?: React.ReactNode;
  /**
   * Allows the component to be rendered with pre-filled results
   */
  initialSearchResults?: {
    type?: string;
    geometry?: {
      type?: string;
      // coordinates?: [number, number];
      coordinates?: number[];
    };
    properties?: { id?: string };
  }[];
  /**
   * Results are sorted by distance, but favored layers will always appear
   * first.
   */
  preferredLayers?: string[];
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
  getCurrentPosition: (locationType: string) => void;
  /**
   * Whether the provided location (if one is provided) should not be shown upon
   * initial render.
   */
  hideExistingValue?: boolean;
  /**
   * Placeholder text to show in the input element. If the current position is
   * set to have a true fetching property, then the text "Fetching location..."
   * will display. If this value isn't provided, the locationType will be shown.
   */
  inputPlaceholder?: string;
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
   * Either `from` or `to`
   */
  locationType: LocationType;
  /**
   * A list of stopIds of the stops that should be shown as being nearby. These
   * must be referencable in the stopsIndex prop.
   */
  nearbyStops?: string[];
  /**
   * Invoked whenever the text input is clicked or when the clear button is
   * clicked.
   */
  onTextInputClick?: () => void;
  /**
   * A function to handle when a location is selected. This is always dispatched
   * with an object of the following form:
   *
   * ```js
   * {
   *  locationType: string,
   *  location: object,
   *  resultType: string
   * }
   * '''
   *
   * The locationType string will be either "from" or "to" as was set by the
   * locationType prop for the instance of this component.
   *
   * The location object will be an object in the form below:
   * ```js
   * {
   *  id: string, // only populated for stops and user-saved locations
   *  lat: number,
   *  lon: number,
   *  name: string
   * }
   *
   * The resultType string indicates the type of location that was selected.
   * It can be one of the following:
   *
   * "CURRENT_LOCATION": The user's current location.
   * "GEOCODE": A location that was found via a geocode search result
   * "SAVED": A location that was saved by the user.
   * "SESSION": A geocoded search result that was recently selected by the user.
   * "STOP": A transit stop
   */
  onLocationSelected: ({
    locationType,
    location,
    resultType
  }: {
    locationType: LocationType;
    location: Location;
    resultType: ResultType;
  }) => void;
  /**
   * Mapping from Pelias *operator* to icon (represented as jsx). Allows results from different Pelias
   * operators to be given a unique Icon.
   */
  operatorIconMap?: { [key: string]: React.ReactNode };
  /**
   * A boolean for whether to override the result sort order and sort by
   * distance.
   */
  sortByDistance?: boolean;
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
   * React style object
   */
  style?: React.CSSProperties;
  /**
   * show autocomplete options as fixed/inline element rather than dropdown
   */
  isStatic?: boolean;
  /**
   * An index of stops by StopId
   */
  stopsIndex?: { [key: string]: TransitIndexStopWithRoutes };
  /**
   * A slot for the icon to display for a stop option
   */
  stopOptionIcon?: React.ReactNode;
  /**
   * If true, do not show nearbyStops or current location as options
   */
  suppressNearby?: boolean;
  /**
   * When showing special categories of transit response, these can be capped
   * to prevent the list of responses from getting too long. This value declares
   * how many responses to show in each category
   */
  suggestionCount?: number;
  /**
   * An array of recent locations and places a user has searched for.
   */
  userLocationsAndRecentPlaces?: UserLocation[];
  /**
   * A custom component for rendering the icon for options that are either saved
   * user locations or recent places. The component will be sent a single prop
   * of `userLocation` which is a userLocationType.
   */
  UserLocationIconComponent?: React.FunctionComponent<{
    userLocation: UserLocation;
  }>;
  /** A slot for a component that can be used to display a custom icon for the
   * clear location button.
   */
  clearButtonIcon?: React.ReactNode;
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

// FIXME: Move to core-utils once core-utils is typescripted
export interface TransitIndexStopWithRoutes {
  /**
   * The stop code if the stop has one
   */
  code?: string;
  /**
   * The distance from the user to the stop in meters
   */
  dist?: number;
  lat?: number;
  lon?: number;
  name?: string;
  routes?: [
    {
      longName?: string;
      shortName?: string;
    }
  ];
}

// FIXME: Move to core-utils once core-utils is typescripted
export type UserLocation = Location & {
  /**
   * Can be either 'home', 'work', or null
   */
  icon?: string;
  /**
   * This represents the last time that this location was selected in a
   * search
   */
  timestamp?: number;
  /**
   * One of: 'home', 'work', 'stop' or 'recent'
   */
  type: "home" | "work" | "stop" | "recent";
};
