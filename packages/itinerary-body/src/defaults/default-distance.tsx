import {
  Distance,
  DistanceProps,
  isImperial
} from "@opentripplanner/humanize-distance";
import React, { ReactElement } from "react";

/**
 * Wrapper around Distance from humanize-distance with imperial defaults and long format when showing imperial units.
 */
const DefaultDistance = ({
  meters,
  units
}: Omit<DistanceProps, "long">): ReactElement => (
  <Distance
    long={isImperial(units, "imperial")}
    meters={meters}
    units={units || "imperial"}
  />
);

export default DefaultDistance;
