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

  let unit;
  let value;
  let unitIfNoIntl;

  if (feet < 528) {
    unit = "foot";
    unitIfNoIntl = abbreviate ? "ft" : "feet";
    value = Math.round(feet);
  } else {
    unit = "mile";
    unitIfNoIntl = abbreviate ? "mi" : "miles";
    value = roundToOneDecimalPlace(feet / 5280);
  }

  return intl
    ? intl.formatNumber(value, {
        unit,
        unitDisplay: abbreviate ? "short" : "long",
        style: "unit"
      })
    : `${value} ${unitIfNoIntl}`;
}

export function humanizeDistanceStringMetric(
  meters: number,
  intl?: IntlShape
): string {
  const km = meters / 1000;
  let unit = "kilometer";
  let shortUnit = "km";
  let value;
  if (km > 100) {
    // 100 km => 999999999 km
    value = Math.round(km);
  } else if (km > 1) {
    // 1.1 km => 99.9 km
    value = roundToOneDecimalPlace(km);
  } else {
    unit = "meter";
    shortUnit = "m";
    value = Math.round(meters);
  }

  return intl
    ? intl.formatNumber(value, {
        unit,
        unitDisplay: "short",
        style: "unit"
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
