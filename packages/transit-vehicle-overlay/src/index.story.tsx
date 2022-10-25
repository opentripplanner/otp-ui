import React from "react";

import vehicleData from "../__mocks__/seattle.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import RouteIcon from "./RouteIcon";
import RouteNumberIcon from "./RouteNumberIcon";
import TransitVehicleOverlay from ".";

const SEATTLE: [number, number] = [47.6, -122.3];

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

export const CircleWithModeIconAndChevron = () => <div>Placeholder</div>;

// Params: angle, [show] route color
export const CircleWithLineNumberAndChevron = () => {
  const vehicle = vehicleData.vehiclePositions[0];
  const { routeColor } = vehicle;
  return (
    <div style={{ backgroundColor: routeColor }}>
      <RouteNumberIcon vehicle={vehicle} />
    </div>
  );
};

// Params: angle, [show] route color
export const CircleWithModeIconRotated = () => <div>Placeholder</div>;

export const CircleWithLineNumberRotated = () => <div>Placeholder</div>;

// Route icons for different vehicles
export const DefaultRouteIcons = () => {
  return vehicleData.vehiclePositions.map((v, i) => (
    <RouteIcon key={i} vehicle={v} />
  ));
};

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlay
};
