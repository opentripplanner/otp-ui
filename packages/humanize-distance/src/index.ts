import { IntlShape } from "react-intl";

import Distance from "./distance";
import { getImperialParams, getMetricParams } from "./util";

export function humanizeDistanceStringImperial(
  meters: number,
  abbreviate?: boolean,
  intl?: IntlShape
): string {
  const { unit, value } = getImperialParams(meters);
  if (intl) {
    return intl.formatNumber(value, {
      style: "unit",
      unit,
      unitDisplay: abbreviate ? "short" : "long"
    });
  }
  const unitIfNoIntl =
    unit === "foot"
      ? abbreviate
        ? "ft"
        : "feet"
      : abbreviate
      ? "mi"
      : "miles";
  return `${value} ${unitIfNoIntl}`;
}

export function humanizeDistanceStringMetric(
  meters: number,
  intl?: IntlShape
): string {
  const { unit, value } = getMetricParams(meters);
  if (intl) {
    return intl.formatNumber(value, {
      style: "unit",
      unit,
      unitDisplay: "short"
    });
  }

  const shortUnit = unit === "meter" ? "m" : "km";
  return `${value} ${shortUnit}`;
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

export { Distance };
