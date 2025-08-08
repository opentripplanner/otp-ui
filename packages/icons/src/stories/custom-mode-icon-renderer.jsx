import React from "react";

import walkTransitWalkItinerary from "@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json";
import { StyledTable } from "../icon-renderer";
import ClassicModeIcon from "../classic-mode-icon";
import CustomModeIcon from "./custom-mode-icon";

const exampleLeg = walkTransitWalkItinerary.legs[1];

const CustomModeIconRenderer = () => (
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
            <ClassicModeIcon leg={exampleLeg} mode={exampleLeg.mode} />
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

export default CustomModeIconRenderer;
