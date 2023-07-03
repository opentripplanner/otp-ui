// Prettier does not recognize the import type syntax.
// eslint-disable-next-line prettier/prettier
import type { MassUnitOption, Itinerary, Money, Leg } from "@opentripplanner/types";
import type { ReactElement } from "react";

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

export interface FareType {
  riderCategoryId: string;
  mediumId: string;
}

/**
 * This is the interface used to define the layout for a particular fare table.
 * The table with be rendered with the columns defined here,
 * with each row being an individual transit leg from the itinerary.
 */
export interface FareTableLayout {
  cols: (FareType & {
    columnHeaderKey: string;
  })[]
  headerKey: string;
}
export interface FareLegTableProps {
  layout?: FareTableLayout[];
  legs: Leg[];
}

// Total fare amount corresponding to a fare key
export type FareTotals = (FareType & { price: Money })[]

export interface TransitFareProps {
  headerKey: string;
  fareMediumId: string
  riderCategoryId: string
  fareNameFallback?: ReactElement;
  fareKeyNameMap: {
    [key: string]: string;
  };
  fareTotals: FareTotals;
}

export interface FareDetailsProps {
  maxTNCFare: number;
  minTNCFare: number;
  legs: Leg[];
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
   * Determines which transit fare should be displayed by default, should there be multiple transit fare types.
   */
  defaultFareType?: { headerKey: string } & FareType;
  /**
   * Slot for a custom component to render the expandable section for departure.
   */
  DepartureDetails?: React.ElementType<DepartureDetailsProps>;
  /**
   * If this is set to true, a row will be added to the trip details displaying how
   * many minutes in total the user will spend walking or biking.
   */
  displayTimeActive?: boolean;
  /**
   * Slot for a custom component to render the expandable section for fares.
   */
  FareDetails?: React.ElementType<FareDetailsProps>;
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
  /**
   * Itinerary that the user has selected to view, contains multiple legs.
   */
  itinerary: Itinerary;
    /**
   * Slot for a custom component to render the expandable section for time active.
   */
  TimeActiveDetails?: React.ElementType<TimeActiveDetailsProps>;
}