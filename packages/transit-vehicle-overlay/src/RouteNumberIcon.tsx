import { TransitVehicle } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** The vehicle to render. */
  vehicle: TransitVehicle;
}

/**
 * Renders the route number (no consideration for length of route short name).
 */
export default function RouteNumberIcon({
  className,
  style,
  vehicle
}: Props): ReactElement {
  const { routeShortName } = vehicle;
  return (
    <span className={className} style={style}>
      {routeShortName || "🚌"}
    </span>
  );
}
