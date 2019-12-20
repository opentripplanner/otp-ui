import React from "react";
import PropTypes from "prop-types";
import * as Icons from "@opentripplanner/icons";
import { isTransit } from "@opentripplanner/core-utils/lib/itinerary";

import { MainModeRow, SecondaryModeRow, TertiaryModeRow } from "./styled";
import ModeButton from "./mode-button";

/**
 * ModeSelector is the control container where the OTP user selects
 * the primary transportation modes, e.g. transit+bike, walk, micromobility...
 */
const ModeSelector = props => {
  const { selectedModes } = props;
  const modesHaveTransit = selectedModes.some(isTransit);

  return (
    <div>
      <MainModeRow>
        <ModeButton
          selected={modesHaveTransit && selectedModes.includes("WALK")}
          title="Take Transit"
          showTitle={false}
        >
          <Icons.TriMet />
          Take Transit
        </ModeButton>
      </MainModeRow>
      <SecondaryModeRow>
        <ModeButton
          selected={modesHaveTransit && selectedModes.includes("BICYCLE")}
          title="Transit + Personal Bike"
        >
          <Icons.TriMet />+<Icons.Bike />
        </ModeButton>
        <ModeButton
          selected={modesHaveTransit && selectedModes.includes("BICYCLE_RENT")}
          title="Transit + BIKETOWN"
        >
          <Icons.TriMet />+<Icons.Biketown />
        </ModeButton>
        <ModeButton
          selected={modesHaveTransit && selectedModes.includes("MICROMOBILITY")}
          title="Transit + E-Scooter"
        >
          <Icons.TriMet />+<Icons.Micromobility />
        </ModeButton>
        <ModeButton
          selected={modesHaveTransit && selectedModes.includes("CAR")}
          title="Park &amp; Ride"
        >
          <Icons.TriMet />+<Icons.Car />
        </ModeButton>
        <ModeButton
          selected={modesHaveTransit && selectedModes.includes("CAR_HAIL")}
          title="Transit + Uber"
        >
          <Icons.TriMet />+<Icons.Uber />
        </ModeButton>
      </SecondaryModeRow>
      <TertiaryModeRow>
        <ModeButton
          selected={selectedModes === ["WALK"]}
          title="Walk Only"
          showTitle={false}
        >
          <Icons.Walk />
          Walk Only
        </ModeButton>
        <ModeButton
          selected={selectedModes === ["BICYCLE"]}
          title="Bike Only"
          showTitle={false}
        >
          <Icons.Bike />
          Bike Only
        </ModeButton>
      </TertiaryModeRow>
    </div>
  );
};

ModeSelector.propTypes = {
  /**
   * An array of strings, each representing one transportation mode used for OTP queries.
   */
  selectedModes: PropTypes.arrayOf(PropTypes.string)
};

ModeSelector.defaultProps = {
  selectedModes: null
};

export default ModeSelector;
