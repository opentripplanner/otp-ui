import { UnitSystem } from "@opentripplanner/types";
import React from "react";
import { FormattedNumber } from "react-intl";
import { getImperialParams, getMetricParams, isImperial } from "./util";

export interface DistanceProps {
  /**
   * Whether to display long units (e.g. "kilometers" vs. "km").
   * @default false
   */
  long?: boolean;
  /**
   * The original distance, in meters, to render.
   */
  meters: number;
  /**
   * Whether to display the specified distance in imperial or metric units.
   * @default "metric"
   */
  units?: UnitSystem;
}

/**
 * Renders a distance expressed in imperial or metric unit.
 * The unit can be shown in long or short form.
 * English examples:
 * - 2.4 kilometers
 * - 807 ft
 */
const Distance = ({ long, meters, units }: DistanceProps): JSX.Element => {
  const { unit, value } = isImperial(units)
    ? getImperialParams(meters)
    : getMetricParams(meters);

  return (
    <FormattedNumber
      // Not a "real" style prop
      // eslint-disable-next-line react/style-prop-object
      style="unit"
      unit={unit}
      unitDisplay={long ? "long" : "short"}
      value={value}
    />
  );
};

export default Distance;
