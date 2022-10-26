import React from "react";
import { ClassicModeIcon } from "@opentripplanner/icons";

import vehicleData from "../__mocks__/seattle.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import { RotatingCircle } from "./TransitIcons";
import TransitVehicleOverlay from ".";
import RouteNumberIcon from "./RouteNumberIcon";

const SEATTLE: [number, number] = [47.6, -122.3];

const vehicles: TransitVehicle[] = vehicleData.vehiclePositions;

export const DefaultAppearance = () => (
  <TransitVehicleOverlay iconPixels={25} vehicles={vehicles} />
);

export const WithRotatingIcons = () => (
  <TransitVehicleOverlay IconContainer={RotatingCircle} vehicles={vehicles} />
);

export const WithCustomModeIcon = () => (
  <TransitVehicleOverlay ModeIcon={ClassicModeIcon} vehicles={vehicles} />
);

export const TransitVehicleOverlayExampleWithoutHoverEffects = () => {
  return (
    <TransitVehicleOverlay
      alwaysRenderText
      disableHoverEffects
      // @ts-expect-error the mock data is incomplete
      vehicles={vehicles}
    />
  );
};

export const ShowingRouteNumbersOnly = () => (
  <TransitVehicleOverlay RouteIcon={RouteNumberIcon} vehicles={vehicles} />
);

/*
// Route icons for different vehicles
export const DefaultRouteIconsWithCarets = () => {
  return vehicleData.vehiclePositions.map((v, i) => (
    <CircleWithCaret key={i} pixels={25} vehicle={v}>
      <RouteIcon vehicle={v} />
    </CircleWithCaret>
  ));
};

// Route icons for different vehicles
export const DefaultRouteIconsRotating = () => {
  return vehicleData.vehiclePositions.map((v, i) => (
    <RotatingCircle key={i} pixels={30} vehicle={v}>
      <RouteIcon vehicle={v} />
    </RotatingCircle>
  ));
};
*/

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlay,
  decorators: [withMap(SEATTLE, 12)]
};
