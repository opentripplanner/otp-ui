import { TransitVehicle } from "@opentripplanner/types";
import React, { FC, ReactElement } from "react";
import BasicModeIcon from "./BasicModeIcon";
import RouteNumberIcon from "./RouteNumberIcon";

interface BasicProps {
  mode: string;
}

export interface VehicleIconProps {
  defaultMode?: string;
  ModeIcon?: FC<BasicProps>;
  vehicle: TransitVehicle;
}

/**
 * Renders the associated mode icon for the given transit vehicle and ModeIcon component.
 * Falls back to the route short name if no icon is found for the desired mode.
 */
export default function VehicleIcon({
  defaultMode,
  ModeIcon = BasicModeIcon,
  vehicle
}: VehicleIconProps): ReactElement {
  // Try to see if content is returned by the ModeIcon function component,
  // if null, fall back to route number.
  return (
    ModeIcon({ mode: vehicle.routeType || defaultMode }) || (
      <RouteNumberIcon vehicle={vehicle} />
    )
  );
}
