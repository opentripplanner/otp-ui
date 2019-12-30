import React from "react";
import { modeSelectorOptionsType } from "@opentripplanner/core-utils/lib/types";
import * as Icons from "@opentripplanner/icons";
import { isTransit } from "@opentripplanner/core-utils/lib/itinerary";

import { MainModeRow, SecondaryModeRow, TertiaryModeRow } from "./styled";
import ModeButton from "./mode-button";
import ModeIcon from "./mode-icon";
import { supportedExclusiveModes } from "./modes";

const makeButton = option => (
  <ModeButton
    selected={option.selected}
    showTitle={option.showTitle}
    title={option.title}
  >
    {option.text}
  </ModeButton>
);

const getPrimaryModeOption = selectedModes => ({
  selected: selectedModes.some(isTransit) && selectedModes.includes("WALK"),
  showTitle: false,
  text: (
    <span>
      <Icons.TriMet />
      Take Transit
    </span>
  ),
  title: "Take Transit"
});

function getTransitCombinedModeOptions(modes, selectedModes) {
  const { accessModes } = modes;
  const modesHaveTransit = selectedModes.some(isTransit);

  return accessModes.map(modeObj => {
    /* In config yaml, you can write either:
        accessModes: 
        - BICYCLE
        - WALK

        or

        accessModes:
        - mode: BICYCLE
          label: "Bike + Transit"
        - mode: WALK
          label: "Walk + Transit"
    */
    const modeStr = modeObj.mode || modeObj;
    return {
      id: `TRANSIT+${modeStr}`,
      selected: modesHaveTransit && selectedModes.includes(modeStr),
      text: (
        <span>
          <Icons.TriMet />+<ModeIcon mode={modeStr} />
        </span>
      ),
      title: modeObj.label
    };
  });
}

function getExclusiveModeOptions(modes, selectedModes) {
  const { exclusiveModes } = modes;

  return supportedExclusiveModes
    .filter(mode => exclusiveModes.includes(mode.mode))
    .map(modeObj => ({
      id: modeObj.mode,
      selected: selectedModes === [modeObj.mode],
      showTitle: false,
      text: (
        <span>
          <ModeIcon mode={modeObj.mode} /> {modeObj.label}
        </span>
      ),
      title: modeObj.label
    }));
}

export function getModeOptions(modes, selectedModes) {
  return {
    primary: getPrimaryModeOption(selectedModes),
    secondary: getTransitCombinedModeOptions(modes, selectedModes),
    tertiary: getExclusiveModeOptions(modes, selectedModes)
  };
}

/**
 * ModeSelector is the control container where the OTP user selects
 * the transportation modes for a trip query, e.g. transit+bike, walk, micromobility...
 */
const ModeSelector = props => {
  const { modes } = props;
  const { primary, secondary, tertiary } = modes || {
    primary: null,
    secondary: null,
    tertiary: null
  };

  return (
    <div>
      {primary && <MainModeRow>{makeButton(primary)}</MainModeRow>}

      {secondary && (
        <SecondaryModeRow>{secondary.map(makeButton)}</SecondaryModeRow>
      )}

      {tertiary && (
        <TertiaryModeRow>{tertiary.map(makeButton)}</TertiaryModeRow>
      )}
    </div>
  );
};

ModeSelector.propTypes = {
  /**
   * An object that defines the primary mode, and secondary and tertiary modes for the trip query.
   */
  modes: modeSelectorOptionsType
};

ModeSelector.defaultProps = {
  modes: null
};

export default ModeSelector;
