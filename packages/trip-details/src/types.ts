// Prettier does not recognize the import type syntax.
// eslint-disable-next-line prettier/prettier
import type { 
  FareProductSelector, 
  Itinerary, 
  Leg, 
  MassUnitOption,
  Money
 } from "@opentripplanner/types";

export interface TimeActiveDetailsProps {
  bikeMinutes: number;
  minutesActive?: number;
  walkMinutes: number;
}

export interface CO2ConfigType {
  carbonIntensity?: Record<string, number>;
  units?: MassUnitOption;
  enabled?: boolean;
}

export interface DepartureDetailsProps {
  departureDate: Date;
}

/**
 * This is the interface used to define the layout for a particular fare table.
 * The table with be rendered with the columns defined here,
 * with each row being an individual transit leg from the itinerary.
 */
export interface FareTableLayout {
  cols: (FareProductSelector & {
    columnHeaderKey: string;
  })[]
  headerKey: string;
}
/**
 * Interface containing the lgs and the layout of the fare table.
 */
export interface FareLegTableProps {
  layout?: FareTableLayout[];
  legs: Leg[];
}

// Total fare amount corresponding to a fare key
export type FareTotals = (FareProductSelector & { price: Money })[]

export interface FareDetailsProps {
  legs: Leg[];
  maxTNCFare: number;
  minTNCFare: number;
}

export interface FareConfig {
  /**
   * Determines which transit fare should be displayed by default, should there be multiple transit fare types.
   * Header key is used only in the old fare display.
   */
  defaultFareType?: { headerKey?: string } & FareProductSelector;
  /**
   * Column and table configuration for fare details/fare by leg table.
   */
  fareDetailsLayout?: FareTableLayout[];
  /**
   * Mapping between fare keys and human-readable names for them.
   */
  fareKeyNameMap?: {
    [name: string]: string;
  };
}

export interface TripDetailsProps {
  /**
   * Used for additional styling with styled components for example.
   */
  className?: string;
    /**
   * Object containing the CO₂ config.
   */
  co2Config?: CO2ConfigType;
  /**
   * Slot for a custom component to render the expandable section for departure.
   */
  DepartureDetails?: React.ElementType<DepartureDetailsProps>;
  /**
   * Slot for a custom component to render the expandable section for fares.
   */
  FareDetails?: React.ElementType<FareDetailsProps>;
  /**
   * Configuration for fare details/fare by leg table.
   */
  fareConfig?: FareConfig;
  /**
   * Itinerary that the user has selected to view, contains multiple legs.
   */
  itinerary: Itinerary;
  /**
   * show the '~' symbol in the trip details panel
   */
  showApproximateMinutesActive?: boolean;
  /**
   * Slot for a custom component to render the expandable section for time active.
   */
  TimeActiveDetails?: React.ElementType<TimeActiveDetailsProps>;
}