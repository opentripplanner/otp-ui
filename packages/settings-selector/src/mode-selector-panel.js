import React, { Component } from "react";
import PropTypes from "prop-types";
import { isTransit } from "@opentripplanner/core-utils/lib/itinerary";

import ModeSelector from "./mode-selector";
import SubmodeSelector from "./submode-selector";
import {
  getModeOptions,
  getTransitSubmodeOptions,
  getCompaniesOptions
} from "./util";
import commonModes from "./__mocks__/modes"; // FIXME: Replace with ref to configuration.
import commonCompanies from "./__mocks__/companies"; // FIXME: Replace with ref to configuration.

const defaultTransitModes = [
  "TRAM", // FIXME: Take these from the 'registered' transit modes in core-utils/itinerary.
  "RAIL",
  "BUS",
  "GONDOLA"
];

export default class ModeSelectorPanel extends Component {
  constructor(props) {
    super(props);

    const { selectedModes, selectedCompanies } = props;

    this.state = {
      selectedModes: selectedModes || [],
      selectedCompanies: selectedCompanies || [],
      defaultCompany: null,
      lastTransitModes: []
    };
  }

  mainModeChangeHandler = id => {
    const { onChange } = this.props;
    if (onChange) onChange(id);

    const newModes = id.split("+");
    if (newModes[0] === "TRANSIT") {
      const { selectedModes } = this.state;
      let { lastTransitModes } = this.state;
      const activeTransitModes = selectedModes.filter(isTransit);
      if (lastTransitModes.length === 0) {
        lastTransitModes = lastTransitModes.concat(defaultTransitModes);
      }

      const nonTransitModes = newModes.length > 1 ? [newModes[1]] : ["WALK"]; // TODO: also accommodate WALK+DRIVE, WALK+e-scooter??
      const defaultCompany = newModes.length > 2 ? [newModes[2]] : null; // To accommodate companies defined under accessModes.

      // Add previously selected transit modes only if none were active.
      const finalModes = (activeTransitModes.length > 0
        ? activeTransitModes
        : lastTransitModes
      ).concat(nonTransitModes);

      const selectedCompanies =
        defaultCompany ||
        getCompaniesOptions(commonCompanies, nonTransitModes, []).map(
          comp => comp.id
        );

      this.setState({
        selectedModes: finalModes,
        selectedCompanies,
        defaultCompany: defaultCompany && defaultCompany[0]
      });
    } else {
      this.setState({
        selectedModes: newModes
      });
    }
  };

  transitModeChangeHandler = id => {
    const { selectedModes } = this.state;
    const newModesArray = this.toggleSubmode(id, selectedModes, isTransit);

    const { onChange } = this.props;
    if (onChange) onChange(id);

    this.setState({
      selectedModes: newModesArray,
      lastTransitModes: newModesArray.filter(isTransit)
    });
  };

  companiesChangeHandler = id => {
    const { selectedCompanies } = this.state;
    const newModesArray = this.toggleSubmode(id, selectedCompanies);

    const { onChange } = this.props;
    if (onChange) onChange(id);

    this.setState({
      selectedCompanies: newModesArray
    });
  };

  toggleSubmode(id, submodes, filter = o => o) {
    const newSubmodes = [].concat(submodes);
    const idx = newSubmodes.indexOf(id);

    // If clicked mode is selected, then remove it, o/w add it.
    // Leave at least one selected, as in newplanner.trimet.org.
    if (idx >= 0) {
      const subset = newSubmodes.filter(filter);
      if (subset.length >= 2) {
        newSubmodes.splice(idx, 1);
      }
    } else {
      newSubmodes.push(id);
    }

    return newSubmodes;
  }

  render() {
    const { className } = this.props;
    const { selectedModes, selectedCompanies, defaultCompany } = this.state;

    const modeOptions = getModeOptions(commonModes, selectedModes);
    const transitModes = getTransitSubmodeOptions(commonModes, selectedModes);
    const nonTransitModes = selectedModes.filter(m => !isTransit(m));
    const companies = getCompaniesOptions(
      commonCompanies.filter(comp =>
        defaultCompany ? comp.id === defaultCompany : true
      ),
      nonTransitModes,
      selectedCompanies
    );

    return (
      <div className={className}>
        <ModeSelector
          modes={modeOptions}
          onChange={this.mainModeChangeHandler}
        />

        <div>Travel Preferences</div>

        {companies.length >= 2 && (
          <div>
            Use companies:
            <SubmodeSelector
              modes={companies}
              onChange={this.companiesChangeHandler}
            />
          </div>
        )}

        {selectedModes.some(isTransit) && transitModes.length >= 2 && (
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
   * An array of selected providers for ride-hailing or rentals, no whitespaces (corresponds to the companies URL parameter).
   */
  selectedCompanies: PropTypes.arrayOf(PropTypes.string),
  /**
   * An array of selected modes, no whitespaces (corresponds to the mode URL parameter).
   */
  selectedModes: PropTypes.arrayOf(PropTypes.string)
};

ModeSelectorPanel.defaultProps = {
  className: null,
  onChange: null,
  selectedCompanies: null,
  selectedModes: null
};
