import React from "react";
import PropTypes from "prop-types";
import { modeSelectorOptionsType } from "@opentripplanner/core-utils/lib/types";

import { MainModeRow, SecondaryModeRow, TertiaryModeRow } from "./styled";
import ModeButton from "../ModeButton";

/**
 * ModeSelector is the control container where the OTP user selects
 * the transportation modes for a trip query, e.g. transit+bike, walk, micromobility...
 */
const ModeSelector = props => {
  const { className, modes, onChange, style } = props;
  const { primary, secondary, tertiary } = modes || {
    primary: null,
    secondary: null,
    tertiary: null
  };

  const handleClick = option => {
    if (!option.selected && typeof onChange === "function") {
      onChange(option.id);
    }
  };

  const makeButton = option => (
    <ModeButton
      key={option.id}
      selected={option.selected}
      showTitle={option.showTitle}
      title={option.title}
      onClick={() => handleClick(option)}
    >
      {option.text}
    </ModeButton>
  );

  return (
    <div className={className} style={style}>
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
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  /**
   * An object that defines the primary mode, and secondary and tertiary modes for the trip query.
   */
  modes: modeSelectorOptionsType,
  /**
   * Triggered when the user selects a different mode.
   * @param id The id of the new option clicked.
   */
  onChange: PropTypes.func
};

ModeSelector.defaultProps = {
  className: null,
  modes: null,
  onChange: null
};

export default ModeSelector;
