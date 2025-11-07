import { UnitSystem } from "@opentripplanner/types";

export interface DistanceParams {
  unit: "meter" | "kilometer" | "foot" | "mile";
  value: number;
}

function roundToOneDecimalPlace(number: number): number {
  return Math.round(number * 10) / 10;
}

export function getImperialParams(meters: number): DistanceParams {
  const feet = meters * 3.28084;
  return feet < 528
    ? {
        unit: "foot",
        value: Math.round(feet)
      }
    : {
        unit: "mile",
        value: roundToOneDecimalPlace(feet / 5280)
      };
}

export function getMetricParams(meters: number): DistanceParams {
  const km = meters / 1000;
  return km > 1
    ? {
        unit: "kilometer",
        value:
          km > 100
            ? // 100 km and over
              Math.round(km)
            : // 1.1 km => 99.9 km
              roundToOneDecimalPlace(km)
      }
    : {
        unit: "meter",
        value: Math.round(meters)
      };
}

/**
 * Determines whether a unit system value is imperial or metric.
 */
export const isImperial = (units?: UnitSystem): boolean => units === "imperial";
