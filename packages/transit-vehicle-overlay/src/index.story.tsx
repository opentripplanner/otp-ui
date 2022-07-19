import React from "react";
import BaseMap from "@opentripplanner/base-map";
import TransitVehicleOverlay from ".";

import vehicleData from "../__mocks__/tm_all.json";

const PORTLAND: [number, number] = [45.523, -122.671];

export const simpleExample = () => {
  console.log(vehicleData.resultSet.vehicle[0]);
  return (
    <BaseMap forceMaxHeight center={PORTLAND}>
      <TransitVehicleOverlay vehicles={[vehicleData.resultSet.vehicle[0]]} />
    </BaseMap>
  );
};

export default {
  title: "TransitVehicleOverlay",
  component: simpleExample
};
