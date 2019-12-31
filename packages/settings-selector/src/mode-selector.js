import React from "react";
import PropTypes from "prop-types";
import { modeSelectorOptionsType } from "@opentripplanner/core-utils/lib/types";
import * as Icons from "@opentripplanner/icons";
import { isTransit } from "@opentripplanner/core-utils/lib/itinerary";

import { MainModeRow, SecondaryModeRow, TertiaryModeRow } from "./styled";
import ModeButton from "./mode-button";
import ModeIcon from "./mode-icon";
import { supportedExclusiveModes } from "./modes";

const getPrimaryModeOption = selectedModes => ({
  id: "TRANSIT",
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
      selected: selectedModes.length === 1 && selectedModes[0] === modeObj.mode,
      showTitle: false,
      text: (
        <span>
          <ModeIcon mode={modeObj.mode} /> {modeObj.label}
        </span>
      ),
      title: modeObj.label
    }));
}

/**
 * Generates the options (primary, secondary, tertiary) for the mode selector based on the modes read from config.yaml.
 * @param {*} modes The modes defined in config.yaml.
 * @param {*} selectedModes An array of string that lists the modes selected for a trip query.
 */
export const getModeOptions = (modes, selectedModes) => ({
  primary: getPrimaryModeOption(selectedModes),
  secondary: getTransitCombinedModeOptions(modes, selectedModes),
  tertiary: getExclusiveModeOptions(modes, selectedModes)
});

/**
 * ModeSelector is the control container where the OTP user selects
 * the transportation modes for a trip query, e.g. transit+bike, walk, micromobility...
 */
const ModeSelector = props => {
  const { modes, onChange } = props;
  const { primary, secondary, tertiary } = modes || {
    primary: null,
    secondary: null,
    tertiary: null
  };

  const onClickHandler = option => {
    if (!option.selected) {
      onChange(option.id);
    }
  };

  const makeButton = option => (
    <ModeButton
      key={option.id /* Triggers a React Dev Tool warning without the key. */}
      selected={option.selected}
      showTitle={option.showTitle}
      title={option.title}
      onClick={() => onClickHandler(option)}
    >
      {option.text}
    </ModeButton>
  );

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
   * modes should be populated using getModeOptions(modes, selectedModes).
   */
  modes: modeSelectorOptionsType,
  /**
   * Triggered when the user selects a different mode.
   */
  onChange: PropTypes.func
};

ModeSelector.defaultProps = {
  modes: null,
  onChange: null
};

export default ModeSelector;
