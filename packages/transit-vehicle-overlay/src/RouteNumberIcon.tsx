import coreUtils from "@opentripplanner/core-utils";
import { TransitVehicle } from "@opentripplanner/types";
import React, { ReactElement } from "react";

interface Props {
  /** Whether to render the line number using the route color attribute, or use an appropriate color otherwise. */
  colorizeText?: boolean;
  /** The vehicle to render. */
  vehicle: TransitVehicle;
}

/**
 * Renders the route number (no consideration for length of route short name).
 */
export default function RouteNumberIcon({
  colorizeText,
  vehicle
}: Props): ReactElement {
  const { routeColor, routeShortName } = vehicle;
  return (
    <span
      style={{
        color: colorizeText
          ? routeColor
          : coreUtils.route.getMostReadableTextColor(routeColor)
      }}
    >
      {routeShortName}
    </span>
  );
}
