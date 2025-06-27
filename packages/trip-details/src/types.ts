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


// Total fare amount corresponding to a fare key
export type FareTotals = (FareProductSelector & { price: Money })[]

export interface FareDetailsProps {
  legs: Leg[];
  maxTNCFare: number;
  minTNCFare: number;
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
  defaultFareType?: FareProductSelector;
  /**
   * Slot for a custom component to render the expandable section for departure.
   */
  DepartureDetails?: React.ElementType<DepartureDetailsProps>;
  /**
   * Slot for a custom component to render the expandable section for fares.
   */
  FareDetails?: React.ElementType<FareDetailsProps>;
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