import React from "react";

import vehicleData from "../__mocks__/seattle.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import CircleWithCaret from "./CircleWithCaret";
import RouteIcon from "./RouteIcon";
import { RotatingCircle } from "./TransitIcons";
import TransitVehicleOverlay from ".";

const SEATTLE: [number, number] = [47.6, -122.3];

export const Empty = () => <TransitVehicleOverlay />;
Empty.decorators = [withMap(SEATTLE, 12)];

export const TransitVehicleOverlayExample = () => {
  // @ts-expect-error the mock data is incomplete
  return <TransitVehicleOverlay vehicles={vehicleData.vehiclePositions} />;
};
TransitVehicleOverlayExample.decorators = [withMap(SEATTLE, 12)];

export const TransitVehicleOverlayExampleWithoutHoverEffects = () => {
  return (
    <TransitVehicleOverlay
      alwaysRenderText
      disableHoverEffects
      // @ts-expect-error the mock data is incomplete
      vehicles={vehicleData.vehiclePositions}
    />
  );
};
TransitVehicleOverlayExampleWithoutHoverEffects.decorators = [
  withMap(SEATTLE, 12)
];

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

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlay
};
