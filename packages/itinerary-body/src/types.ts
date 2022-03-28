import { FunctionComponent } from "react";

import {
  Config,
  Fare,
  GradationMap,
  Itinerary,
  Leg,
  LegIconComponent,
  Place,
  TimeOptions,
  TransitOperator
} from "@opentripplanner/types";

export interface RouteDescriptionProps {
  /** Contains details about leg object that is being displayed */
  leg: Leg;
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: LegIconComponent;
  /** The transit operator associated with the route if available */
  transitOperator: TransitOperator;
}

export type ToRouteAbbreviationFunction = (route: string | number) => string;

export interface LegDestination {
  /** whether this place row represents the destination */
  isDestination: boolean;
  /** Contains details about leg object that is being displayed */
  leg: Leg;
}

export type TimeColumnContentProps = LegDestination;

/**
 * Shared props for various components that render leg data.
 */
export interface LegSharedProps extends LegDestination {
  /** Contains details about the leg object prior to the current one */
  lastLeg?: Leg;
  /** The index value of this specific leg within the itinerary */
  legIndex: number;
}

export interface LineColumnContentProps extends LegSharedProps {
  /** Whether this leg is an interlined-transit leg */
  interline: boolean;
  LegIcon: LegIconComponent;
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: ToRouteAbbreviationFunction;
}

export interface PlaceNameProps {
  config: Config;
  interline?: boolean;
  place: Place;
}

export type SetActiveLegFunction = (legIndex: number, leg: Leg) => void;

export type FrameLegFunction = (
  args: LegSharedProps & {
    place: Place;
  }
) => void;

export interface TripSection {
  fromIndex: number;
  toIndex: number;
  tripId: string;
}

export type SetViewedTripFunction = (tripSection: TripSection) => void;

export interface TransitLegSubheaderProps {
  leg: Leg;
  onStopClick?: ({ stopId: string }) => void;
}

export interface TransitLegSummaryProps {
  leg: Leg;
  onClick?: () => void;
  stopsExpanded: boolean;
}

/**
 * Shared props for various components that render itinerary data.
 */
interface ItineraryBodySharedProps {
  /**
   * A mapping of accessibility score to color, icon, and text used
   * to override the default one shipped in AccessibilityLabel
   */
  accessibilityScoreGradationMap?: GradationMap;
  /**
   * A custom icon component inserted into the transit alert body component
   * within a transit leg, if this prop is not supplied a default icon is used
   */
  AlertBodyIcon?: FunctionComponent;
  /**
   * A custom icon component inserted into the transit alert toggle button
   * within a transit leg, if this prop is not supplied a default icon is used
   */
  AlertToggleIcon?: FunctionComponent;
  /**
   * Used for additional styling with styled components for example.
   */
  className?: string;
  /** Contains OTP configuration details. */
  config: Config;
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible?: Leg;
  /**
   * Called upon clicking the map icon on place headers. This function is sent a
   * single argument of an object with the keys as follow:
   * - `leg`: the leg clicked (can be null if the destination is clicked)
   * - `legIndex`: the index of the leg clicked (can be null if the destination
   *    is clicked)
   * - `isDestination`: if the place header that is clicked is the destination
   * - `place`: The place associated with the click event
   */
  frameLeg?: FrameLegFunction;
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: LegIconComponent;
  /**
   * A slot for a component that can render the content in the line column.
   * This component is sent the following props:
   * - interline - whether this place is an interlined stop
   * - isDestination - whether this place is the destination
   * - lastLeg - the leg prior to the current leg
   * - leg - the current leg
   * - LegIcon - the LegIcon class used to render leg icons.
   * - legIndex - the current leg index
   * - toRouteAbbreviation - a function to help abbreviate route names
   */
  LineColumnContent: FunctionComponent<LineColumnContentProps>;
  /** Handler for when a Mapillary button is clicked. */
  mapillaryCallback?: (id: string) => void;
  /**
   * Mapillary key used to fetch imagery if available. Key can be obtained from
   * https://www.mapillary.com/dashboard/developers
   */
  mapillaryKey?: string;
  /**
   * A custom component for rendering the place name of legs.
   * The component is sent 3 props:
   * - config: the application config
   * - interline: whether this place is an interlined stop (a stop where a
   *   transit vehicle changes routes, but a rider can continue riding without
   *   deboarding)
   * - place: the particular place. Typically this is the from place, but it
   *   could also be the to place if it is the destination of the itinerary.
   */
  PlaceName: FunctionComponent<PlaceNameProps>;
  /**
   * A component to render the name of a route.
   *
   * The component is sent 3 props:
   * - leg: the itinerary leg with the transit information
   * - LegIcon: component that renders the icon for a leg.
   * - transitOperator: the transit operator associated with the route if available
   */
  RouteDescription: FunctionComponent<RouteDescriptionProps>;
  /** TODO: Routing Type is usually 'ITINERARY' but we should get more details on what this does */
  routingType?: string;
  /**
   * Sets the active leg and legIndex.
   * Called with 2 arguments: (legIndex, leg)
   */
  setActiveLeg: SetActiveLegFunction;
  /** Handler for when a leg diagram is selected. */
  setLegDiagram: (leg: Leg) => void;
  /** Fired when a user clicks on a view trip button of a transit leg */
  setViewedTrip: SetViewedTripFunction;
  /** If true, will show agency information in transit legs */
  showAgencyInfo?: boolean;
  /** If true, will show the elevation profile for walk/bike legs */
  showElevationProfile?: boolean;
  /** If true will show the leg icon in the leg body */
  showLegIcon?: boolean;
  /** If true, will show the right column with the map button */
  showMapButtonColumn?: boolean;
  /** If true, will show fare information in transit leg bodies */
  showRouteFares?: boolean;
  /** If true, shows the view trip button in transit leg bodies */
  showViewTripButton?: boolean;
  /**
   * A slot for a component that can render the content in the time column portion of ItineraryBody.
   * This component is sent the following props:
   * - isDestination - whether this place is the destination
   * - leg - the current leg
   * - timeOptions - options for formatting time.
   */
  TimeColumnContent?: FunctionComponent<TimeColumnContentProps>;
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions?: TimeOptions;
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation?: ToRouteAbbreviationFunction;
  /**
   * An optional custom component for rendering a subheader on transit legs.
   * * The component is sent the following props:
   * - leg: the transit leg
   * - onStopClick: triggered when the optional stop icon is clicked.
   */
  TransitLegSubheader?: FunctionComponent<TransitLegSubheaderProps>;
  /**
   * A custom component for rendering the summary of a transit leg.
   * The component is sent 2 props:
   * - leg: the transit leg
   * - stopsExpanded: whether the intermediate stop display is currently expanded
   */
  TransitLegSummary: FunctionComponent<TransitLegSummaryProps>;
}

export interface PlaceRowProps
  extends ItineraryBodySharedProps,
    LegSharedProps {
  /** The fare information to be displayed for the corresponding leg. */
  fare: Fare;
  /** Indicates whether this leg directly follows a transit leg */
  followsTransit?: boolean;
}

export interface ItineraryBodyProps extends ItineraryBodySharedProps {
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: Itinerary;
}
