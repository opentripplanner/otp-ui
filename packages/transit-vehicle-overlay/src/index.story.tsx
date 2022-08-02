import React from "react";

import vehicleData from "../__mocks__/tm_all.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import TransitVehicleOverlay from ".";

const PORTLAND: [number, number] = [45.523, -122.671];

export const TransitVehicleOverlayExample = () => {
  return (
    <TransitVehicleOverlay vehicles={[vehicleData.resultSet.vehicle[0]]} />
  );
};

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlayExample,
  decorators: [withMap(PORTLAND, 8)]
};
