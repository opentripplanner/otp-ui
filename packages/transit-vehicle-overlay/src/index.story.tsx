import React from "react";
import BaseMap, { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import TransitVehicleOverlay from ".";

import vehicleData from "../__mocks__/tm_all.json";

const PORTLAND: [number, number] = [45.523, -122.671];

export const simpleExample = () => {
  return (
    <BaseMapStyled.StoryMapContainer>
      <BaseMap center={PORTLAND}>
        <TransitVehicleOverlay vehicles={[vehicleData.resultSet.vehicle[0]]} />
      </BaseMap>
    </BaseMapStyled.StoryMapContainer>
  );
};

export default {
  title: "TransitVehicleOverlay",
  component: simpleExample
};
