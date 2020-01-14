import React from "react";
import PropTypes from "prop-types";
import { modeOptionType } from "@opentripplanner/core-utils/lib/types";

import { SubmodeRow } from "./styled";
import ModeButton from "../ModeButton";

/**
 * SubmodeSelector is the control container where the OTP user selects
 * the submodes (e.g. train, bus) for transit, or the providers for TNC and rental companies.
 */
const SubmodeSelector = props => {
  const { className, modes, onChange, style } = props;

  return (
    <SubmodeRow className={className} style={style}>
      {modes &&
        modes.map(option => (
          <ModeButton
            /* If key is missing, a warning in React Dev Tools is triggered. */
            key={option.id}
            selected={option.selected}
            showTitle={false}
            title={option.title}
            onClick={() => onChange(option.id)}
          >
            {option.text}
          </ModeButton>
        ))}
    </SubmodeRow>
  );
};

SubmodeSelector.propTypes = {
  /**
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  /**
   * An array of submodes for the trip query, i.e. transit modes, TNC, or rental companies.
   * modes should be populated using getModeOptions(modes, selectedModes).
   */
  modes: PropTypes.arrayOf(modeOptionType),
  /**
   * Triggered when the user toggles a submode.
   * @param id The id of the option clicked.
   */
  onChange: PropTypes.func
};

SubmodeSelector.defaultProps = {
  className: null,
  modes: null,
  onChange: null
};

export default SubmodeSelector;
