import React from "react";
import { ClassicModeIcon, TriMetModeIcon } from "@opentripplanner/icons";
import vehicleData from "../__mocks__/seattle.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import TransitVehicleOverlay, {
  Circle,
  DefaultIconContainer,
  RouteNumberIcon,
  RotatingCircle,
  withCaret,
  withRouteColorBackground
} from ".";

const SEATTLE: [number, number] = [47.6, -122.3];

// TODO: TransitVehicle[] type doesn't match with vehicles object
const vehicles: TransitVehicle[] = vehicleData.vehiclePositions;

const CircleWithInnerCaret = withCaret(Circle, { position: "inner" });

export const Default = () => (
  <TransitVehicleOverlay ModeIcon={TriMetModeIcon} vehicles={vehicles} />
);

export const RotatingIconsNoCaret = () => (
  <TransitVehicleOverlay
    IconContainer={RotatingCircle}
    ModeIcon={TriMetModeIcon}
    vehicles={vehicles}
  />
);

export const CustomModeIcon = () => (
  <TransitVehicleOverlay ModeIcon={ClassicModeIcon} vehicles={vehicles} />
);

export const InnerCaret = () => (
  <TransitVehicleOverlay
    IconContainer={CircleWithInnerCaret}
    ModeIcon={TriMetModeIcon}
    vehicles={vehicles}
  />
);

export const OuterCaretWithCustomSize = () => (
  <TransitVehicleOverlay
    IconContainer={withCaret(Circle, { height: 15, offset: 4, width: 10 })}
    iconPixels={25}
    ModeIcon={TriMetModeIcon}
    vehicles={vehicles}
  />
);

export const RouteColorBackground = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(DefaultIconContainer, null)}
    ModeIcon={TriMetModeIcon}
    vehicles={vehicles}
  />
);

export const RouteColorBackgroundWithTransparencyOnHover = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(DefaultIconContainer, {
      alphaHex: "aa",
      display: "onhover"
    })}
    ModeIcon={TriMetModeIcon}
    vehicles={vehicles}
  />
);

export const RouteColorBackgroundWithInnerCaret = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(CircleWithInnerCaret, null)}
    iconPadding={4}
    ModeIcon={TriMetModeIcon}
    vehicles={vehicles}
  />
);

export const DefaultRouteColorWhenVehicleRouteColorAbsent = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(DefaultIconContainer, {
      defaultColor: "#00FF00"
    })}
    ModeIcon={TriMetModeIcon}
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
    ModeIcon={TriMetModeIcon}
    VehicleIcon={RouteNumberIcon}
    vehicles={vehicles}
  />
);

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlay,
  decorators: [withMap(SEATTLE, 12)]
};
