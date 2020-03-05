import React from "react";
import PropTypes from "prop-types";
import { callIfValid } from "@opentripplanner/core-utils/lib/functions";
import { modeSelectorOptionsType } from "@opentripplanner/core-utils/lib/types";

import * as Styled from "../styled";
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
    if (!option.selected) {
      callIfValid(onChange)(option.id);
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
    <Styled.ModeSelector className={className} style={style}>
      {primary && (
        <Styled.ModeSelector.MainRow>
          {makeButton(primary)}
        </Styled.ModeSelector.MainRow>
      )}

      {secondary && (
        <Styled.ModeSelector.SecondaryRow>
          {secondary.map(makeButton)}
        </Styled.ModeSelector.SecondaryRow>
      )}
      {tertiary && (
        <Styled.ModeSelector.TertiaryRow>
          {tertiary.map(makeButton)}
        </Styled.ModeSelector.TertiaryRow>
      )}
    </Styled.ModeSelector>
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
