import React from "react";
import TransitVehicleOverlay from ".";

import vehicleData from "../__mocks__/tm_all.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

const PORTLAND: [number, number] = [45.523, -122.671];

export const simpleExample = () => {
  return (
    <TransitVehicleOverlay vehicles={[vehicleData.resultSet.vehicle[0]]} />
  );
};

export default {
  title: "TransitVehicleOverlay",
  component: simpleExample,
  decorators: [withMap(PORTLAND, 8)]
};
