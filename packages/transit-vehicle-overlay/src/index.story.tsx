import React from "react";

import vehicleData from "../__mocks__/seattle.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import TransitVehicleOverlay from ".";

const SEATTLE: [number, number] = [47.6, -122.3];

export const TransitVehicleOverlayExample = () => {
  // @ts-expect-error the mock data is incomplete
  return <TransitVehicleOverlay vehicles={vehicleData.vehiclePositions} />;
};
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

export const SeattleExample = () => {
  return (
    <TransitVehicleOverlay vehicles={seattleVehicleData.vehiclePositions} />
  );
};

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlay,
  decorators: [withMap(SEATTLE, 12)]
};
