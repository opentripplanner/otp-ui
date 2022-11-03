import React from "react";
import { ClassicModeIcon } from "@opentripplanner/icons";

import vehicleData from "../__mocks__/seattle.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import TransitVehicleOverlay, {
  Circle,
  RouteNumberIcon,
  RotatingCircle,
  withCaret,
  withRouteColorBackground
} from ".";

const SEATTLE: [number, number] = [47.6, -122.3];

const vehicles: TransitVehicle[] = vehicleData.vehiclePositions;

export const CustomIconSize = () => (
  <TransitVehicleOverlay iconPixels={25} vehicles={vehicles} />
);

export const RotatingIconsNoCaret = () => (
  <TransitVehicleOverlay IconContainer={RotatingCircle} vehicles={vehicles} />
);

export const CustomModeIcon = () => (
  <TransitVehicleOverlay ModeIcon={ClassicModeIcon} vehicles={vehicles} />
);

export const InnerCaret = () => (
  <TransitVehicleOverlay
    IconContainer={withCaret(Circle, { position: "inner" })}
    vehicles={vehicles}
  />
);

export const OuterCaretWithCustomSize = () => (
  <TransitVehicleOverlay
    IconContainer={withCaret(Circle, { pixels: 12 })}
    vehicles={vehicles}
  />
);

export const RouteColorBackground = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(withCaret(Circle))}
    vehicles={vehicles}
  />
);

export const RouteColorBackgroundWithTransparencyOnHover = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(
      withCaret(Circle, { position: "inner" }),
      {
        alphaHex: "aa",
        display: "onhover"
      }
    )}
    vehicles={vehicles}
  />
);

export const DefaultRouteColorWhenVehicleRouteColorAbsent = () => (
  <TransitVehicleOverlay
    IconContainer={withRouteColorBackground(withCaret(Circle), {
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
