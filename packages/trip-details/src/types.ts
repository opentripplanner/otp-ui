// Prettier does not recognize the import type syntax.
// eslint-disable-next-line prettier/prettier
import type { FareDetails, Money, Itinerary, Leg, Fare, } from "@opentripplanner/types";
import type { ReactElement } from "react";

export interface CaloriesDetailsProps {
  bikeSeconds: number;
  calories: number;
  walkSeconds: number;
}

export interface CO2ConfigType {
  carbonIntensity?: { [index: string]: number };
  units?: string;
  enabled: boolean;
}

export interface DepartureDetailsProps {
  departureDate: Date;
}

export enum FareTableText {
  regular = "regular",
  youth = "youth",
  senior = "senior",
  special = "special",
  cash = "cash",
  electronic = "electronic"
}

export interface FareTableLayout {
  cols: {
    header: FareTableText;
    key: string;
  }[];
  header: FareTableText;
}
export interface TransitFareData {
  [key: string]: Money
}

export interface FareDetailsProps {
  maxTNCFare: number;
  minTNCFare: number;
  transitFares: TransitFareData;
}

export interface FareLegTableProps {
  layout?: FareTableLayout[];
  legs?: Leg[];
  transitFareDetails?: FareDetails;
  transitFares?: TransitFareData;
}

export interface TransitFareProps {
  fareKey: string;
  fareNameFallback?: ReactElement;
  fareKeyNameMap: {
    [key: string]: string;
  };
  transitFares: Fare;
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
   * Object containing the CO2 config.
   */
  co2Config?: CO2ConfigType;
}
