import { FunctionComponent, ReactElement } from "react";

import {
  Config,
  Leg,
  Place,
  TimeOptions,
  TransitOperator
} from "@opentripplanner/types";

export interface RouteDescriptionProps {
  leg: Leg;
  LegIcon: FunctionComponent<{ leg: Leg }>;
  transitOperator: TransitOperator;
}

export type LegIconComponent = FunctionComponent<{
  leg: Leg;
  title?: string;
  width?: string;
}>;

export type GradationMap = Record<
  number,
  { color: string; icon?: ReactElement; text?: string }
>;

export type ToRouteAbbreviationFunction = (route: string | number) => string;

export interface TimeColumnContentProps {
  isDestination: boolean;
  leg: Leg;
  timeOptions: TimeOptions;
}

export interface LineColumnContentProps {
  /** Whether this leg is an interlined-transit leg */
  interline: boolean;
  /** Whether this place row represents the destination */
  isDestination: boolean;
  /** Contains details about leg object that is being displayed */
  lastLeg?: Leg;
  /** Contains details about leg object that is being displayed */
  leg: Leg;
  /** A component class used to render the icon for a leg */
  LegIcon: LegIconComponent;
  /** the index of the leg in the itinerary leg list */
  legIndex: number;
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: ToRouteAbbreviationFunction;
}

export interface PlaceNameProps {
  config: Config;
  interline?: boolean;
  place: Place;
}

export type SetActiveLegFunction = (legIndex: number, leg: Leg) => void;

export type FrameLegFunction = (args: {
  isDestination: boolean;
  leg: Leg;
  legIndex: number;
  place: Place;
}) => void;

export interface TripSection {
  fromIndex: number;
  toIndex: number;
  tripId: string;
}

export type SetViewedTripFunction = (tripSection: TripSection) => void;

export interface TransitLegSubheaderProps {
  languageConfig: any; // FIXME: remove
  leg: Leg;
  onStopClick?: ({ stopId: string }) => void;
}

export interface TransitLegSummaryProps {
  leg: Leg;
  onClick?: () => void;
  stopsExpanded: boolean;
}
