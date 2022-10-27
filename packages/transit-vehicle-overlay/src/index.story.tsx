import React from "react";
import { ClassicModeIcon } from "@opentripplanner/icons";

import vehicleData from "../__mocks__/seattle.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import TransitVehicleOverlay, {
  CircleWithCaret,
  RouteNumberIcon,
  RotatingCircle,
  withRouteColorBackground,
  withRouteColorBackgroundOnHover
} from ".";

const SEATTLE: [number, number] = [47.6, -122.3];

const vehicles: TransitVehicle[] = vehicleData.vehiclePositions;

export const CustomIconSize = () => (
  <TransitVehicleOverlay iconPixels={25} vehicles={vehicles} />
);

export const WithRotatingIcons = () => (
  <TransitVehicleOverlay IconContainer={RotatingCircle} vehicles={vehicles} />
);

export const WithCustomModeIcon = () => (
  <TransitVehicleOverlay ModeIcon={ClassicModeIcon} vehicles={vehicles} />
);

export const WithRouteColorBackground = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(CircleWithCaret)}
    vehicles={vehicles}
  />
);

export const WithRouteColorBackgroundOnHover = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackgroundOnHover(CircleWithCaret)}
    vehicles={vehicles}
  />
);

export const ShowingRouteNumbersOnly = () => (
  <TransitVehicleOverlay VehicleIcon={RouteNumberIcon} vehicles={vehicles} />
);

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlay,
  decorators: [withMap(SEATTLE, 12)]
};
