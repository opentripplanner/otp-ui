import React from "react";
import { StyledTable } from "../icon-renderer";
import ClassicModeIcon from "../classic-mode-icon";
import CustomModeIcon from "./custom-mode-icon";

const walkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json");

const exampleLeg = walkTransitWalkItinerary.legs[1];

const CustomModeIconRenderer = () => {
  return (
    <StyledTable>
      <thead>
        <tr>
          <th>{exampleLeg.mode}</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Classic Mode</td>
          <td>
            <div>
              <ClassicModeIcon mode={exampleLeg.mode} leg={exampleLeg} />
            </div>
          </td>
        </tr>
        <tr>
          <td>Custom Mode by Route Id</td>
          <td>
            <div>
              <CustomModeIcon mode={exampleLeg.mode} leg={exampleLeg} />
            </div>
          </td>
        </tr>
      </tbody>
    </StyledTable>
  );
};

export default CustomModeIconRenderer;
