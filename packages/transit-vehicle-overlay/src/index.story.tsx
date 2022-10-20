import React from "react";

import seattleVehicleData from "../__mocks__/seattle.json";
import trimetVehicleData from "../__mocks__/tm_all.json";
import { withMap } from "../../../.storybook/base-map-wrapper";

import TransitVehicleOverlay from ".";

const PORTLAND: [number, number] = [45.523, -122.671];
const SEATTLE: [number, number] = [47.6129432, -122.4821484];

export const TrimetExample = () => {
  return (
    <TransitVehicleOverlay vehicles={trimetVehicleData.resultSet.vehicle} />
  );
};
TrimetExample.decorators = [withMap(PORTLAND, 8)];

export const SeattleExample = () => {
  return (
    <TransitVehicleOverlay vehicles={seattleVehicleData.vehiclePositions} />
  );
};
SeattleExample.decorators = [withMap(SEATTLE, 8)];

export default {
  title: "TransitVehicleOverlay",
  component: TransitVehicleOverlay
};
