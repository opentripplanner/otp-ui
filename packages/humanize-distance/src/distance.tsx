import React from "react";
import { FormattedNumber } from "react-intl";
import { getImperialParams, getMetricParams } from "./util";

export interface Props {
  /**
   * Whether to display the specified distance in imperial or metric units.
   * @default false
   */
  imperial?: boolean;
  /**
   * Whether to display long units (e.g. "kilometers" vs. "km").
   * @default false
   */
  long?: boolean;
  /**
   * The original distance, in meters, to render.
   */
  meters: number;
}

/**
 * Renders a distance expressed in imperial or metric unit.
 * The unit can be shown both in long or short form.
 * English examples:
 * - 2.415 kilometers
 * - 807 ft
 */
const Distance = ({ imperial, long, meters }: Props): JSX.Element => {
  const { unit, value } = imperial
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
