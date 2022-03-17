import { IntlShape } from "react-intl";

function roundToOneDecimalPlace(number: number): number {
  return Math.round(number * 10) / 10;
}

export function humanizeDistanceStringImperial(
  meters: number,
  abbreviate?: boolean,
  intl?: IntlShape
): string {
  const feet = meters * 3.28084;

  let unit = "mile";
  let unitIfNoIntl = abbreviate ? "mi" : "miles";
  let value = roundToOneDecimalPlace(feet / 5280);

  if (feet < 528) {
    unit = "foot";
    unitIfNoIntl = abbreviate ? "ft" : "feet";
    value = Math.round(feet);
  }

  return intl
    ? intl.formatNumber(value, {
        style: "unit",
        unit,
        unitDisplay: abbreviate ? "short" : "long"
      })
    : `${value} ${unitIfNoIntl}`;
}

export function humanizeDistanceStringMetric(
  meters: number,
  intl?: IntlShape
): string {
  const km = meters / 1000;
  let unit = "meter";
  let shortUnit = "m";
  let value = Math.round(meters);

  if (km > 1) {
    unit = "kilometer";
    shortUnit = "km";
    value =
      km > 100
        ? // 100 km and over
          Math.round(km)
        : // 1.1 km => 99.9 km
          roundToOneDecimalPlace(km);
  }

  return intl
    ? intl.formatNumber(value, {
        style: "unit",
        unit,
        unitDisplay: "short"
      })
    : `${value} ${shortUnit}`;
}

export function humanizeDistanceString(
  meters: number,
  outputMetricUnits = false,
  intl?: IntlShape
): string {
  return outputMetricUnits
    ? humanizeDistanceStringMetric(meters, intl)
    : humanizeDistanceStringImperial(meters, null, intl);
}
