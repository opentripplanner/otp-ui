// Prettier does not recognize the import type syntax.
// eslint-disable-next-line prettier/prettier
import type { Itinerary } from "@opentripplanner/types";
import type { ReactElement } from "react";

export interface CaloriesDetailsProps {
  bikeSeconds: number;
  calories: number;
  walkSeconds: number;
}

export interface CO2ConfigType {
  carbonIntensity: { [index: string]: number };
  units: string;
}

export interface DepartureDetailsProps {
  departureDate: Date;
}

export interface TransitFareData {
  [key: string]: {
    currencyCode: string;
    transitFare: number;
  }
}

export interface FareDetailsProps {
  maxTNCFare: number;
  minTNCFare: number;
  transitFares: TransitFareData;
}

export interface TransitFareProps {
  fareKey: string;
  fareNameFallback?: ReactElement;
  fareKeyNameMap: {
    [key: string]: string;
  };
  transitFares: TransitFareData;
}

export interface TripDetailsProps {
  /**
   * Slot for a custom component to render the expandable section for calories.
   */
  CaloriesDetails?: React.ElementType<CaloriesDetailsProps>;
  /**
   * Used for additional styling with styled components for example.
   */
  className?: string;
  /**
   * Determines which transit fare should be displayed by default, should there be multiple transit fare types.
   */
  defaultFareKey?: string;
  /**
   * Slot for a custom component to render the expandable section for departure.
   */
  DepartureDetails?: React.ElementType<DepartureDetailsProps>;
  /**
   * Slot for a custom component to render the expandable section for fares.
   */
  FareDetails?: React.ElementType<FareDetailsProps>;
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
   * Object containing the CO2 config. CO2 only shown if this value is provided.
   */
  co2Config?: CO2ConfigType;
}
