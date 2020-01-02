import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  hasTransit,
  isTransit
} from "@opentripplanner/core-utils/lib/itinerary";

import ModeSelector from "./mode-selector";
import SubmodeSelector from "./submode-selector";
import { getModeOptions, getTransitSubmodeOptions } from "./util";
import commonModes from "./__mocks__/modes"; // FIXME: Replace with ref to configuration.

export default class ModeSelectorPanel extends Component {
  constructor(props) {
    super(props);

    const { selectedModes } = props;

    this.state = {
      selectedModes
    };
  }

  mainModeChangeHandler = id => {
    const newModes = id.split("+");
    const finalModes =
      newModes[0] === "TRANSIT"
        ? [
            "TRAM", // FIXME: Take these from the 'registered' transit modes in core-utils/itinerary.
            "RAIL",
            "BUS",
            "GONDOLA",
            newModes.length > 1 ? newModes[1] : "WALK"
          ]
        : newModes;

    const { onChange } = this.props;
    if (onChange) onChange(id);

    this.setState({ selectedModes: finalModes.join(",") });
  };

  transitModeChangeHandler = id => {
    const { selectedModes } = this.state;
    const selectedModesArray = selectedModes.split(",");
    const idx = selectedModesArray.indexOf(id);

    // If clicked mode is selected, then remove it, o/w add it.
    // Leave at least one selected per newplanner.trimet.org.
    if (idx >= 0) {
      // Count transit modes remaining
      const transitModeCount = selectedModesArray.filter(isTransit).length;

      if (transitModeCount >= 2) selectedModesArray.splice(idx, 1);
    } else {
      selectedModesArray.push(id);
    }

    const { onChange } = this.props;
    if (onChange) onChange(id);

    this.setState({ selectedModes: selectedModesArray.join(",") });
  };

  render() {
    const { className } = this.props;
    const { selectedModes } = this.state;
    const selectedModesArray = selectedModes.split(",");

    const modeOptions = getModeOptions(commonModes, selectedModesArray);

    const transitModes = getTransitSubmodeOptions(
      commonModes,
      selectedModesArray
    );

    return (
      <div className={className}>
        <ModeSelector
          className={className}
          modes={modeOptions}
          onChange={this.mainModeChangeHandler}
        />
        <div>Travel Preferences</div>
        {hasTransit(selectedModes) && (
          <div>
            Use:
            <SubmodeSelector
              modes={transitModes}
              onChange={this.transitModeChangeHandler}
            />
          </div>
        )}
      </div>
    );
  }
}

ModeSelectorPanel.propTypes = {
  /**
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  onChange: PropTypes.func, // onChange(<SETTING_ID>)
  /**
   * A comma-separated list of selected modes, no whitespaces (corresponds to the mode URL parameter).
   */
  selectedModes: PropTypes.string
};

ModeSelectorPanel.defaultProps = {
  className: null,
  onChange: null,
  selectedModes: "WALK,TRAM,RAIL,BUS,GONDOLA"
};
