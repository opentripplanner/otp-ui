import React from "react";
import { ClassicModeIcon } from "@opentripplanner/icons";

import vehicleData from "../__mocks__/seattle.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import TransitVehicleOverlay, {
  CircleWithCaret,
  RouteNumberIcon,
  RotatingCircle,
  withRouteColorBackground
} from ".";

const SEATTLE: [number, number] = [47.6, -122.3];

const vehicles: TransitVehicle[] = vehicleData.vehiclePositions;

export const CustomIconSize = () => (
  <TransitVehicleOverlay iconPixels={25} vehicles={vehicles} />
);

export const RotatingIcons = () => (
  <TransitVehicleOverlay IconContainer={RotatingCircle} vehicles={vehicles} />
);

export const CustomModeIcon = () => (
  <TransitVehicleOverlay ModeIcon={ClassicModeIcon} vehicles={vehicles} />
);

export const RouteColorBackground = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(CircleWithCaret)}
    vehicles={vehicles}
  />
);

export const RouteColorBackgroundOnHover = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(CircleWithCaret, {
      display: "onhover"
    })}
    vehicles={vehicles}
  />
);

export const DefaultRouteColorWhenVehicleRouteColorAbsent = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(CircleWithCaret, {
      defaultColor: "#00FF00"
    })}
    vehicles={vehicles.map(v => {
      const { routeColor, ...vehicleProps } = v;
      return vehicleProps;
    })}
  />
);

export const RouteNumbersOnlyWithCustomSizeAndPadding = () => (
  <TransitVehicleOverlay
    iconPadding={2}
    iconPixels={25}
    VehicleIcon={RouteNumberIcon}
    vehicles={vehicles}
  />
);

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlay,
  decorators: [withMap(SEATTLE, 12)]
};
