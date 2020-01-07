import React, { Component } from "react";
import PropTypes from "prop-types";
import { isTransit } from "@opentripplanner/core-utils/lib/itinerary";

import ModeSelector from "../ModeSelector";
import SubmodeSelector from "../SubmodeSelector";
import GeneralSettingsPanel from "../GeneralSettingsPanel";
import {
  getModeOptions,
  getTransitSubmodeOptions,
  getCompaniesOptions,
  getBicycleModeOptions,
  isBike
} from "../util";
import commonModes from "../__mocks__/modes"; // FIXME: Replace with ref to configuration.
import commonCompanies from "../__mocks__/companies"; // FIXME: Replace with ref to configuration.

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
    const { onQueryParamChange } = this.props;
    const isEventValid = typeof onQueryParamChange === "function";

    const newModes = id.split("+");
    if (newModes[0] === "TRANSIT") {
      const { selectedModes } = this.state;
      let { lastTransitModes } = this.state;
      const activeTransitModes = selectedModes.filter(isTransit);
      if (lastTransitModes.length === 0) {
        lastTransitModes = lastTransitModes.concat(defaultTransitModes);
      }

      const nonTransitModes = newModes.length > 1 ? [newModes[1]] : ["WALK"]; // TODO: also accommodate WALK+DRIVE, WALK+e-scooter?? They already seem to work without WALK right now.
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

      if (isEventValid) {
        onQueryParamChange({
          mode: finalModes.join(","),
          companies: selectedCompanies.join(",")
        });
      }

      this.setState({
        selectedModes: finalModes,
        selectedCompanies,
        defaultCompany: defaultCompany && defaultCompany[0]
      });
    } else {
      if (isEventValid) {
        onQueryParamChange({
          mode: newModes.join(","),
          companies: "" // New req: Don't list companies with this mode?
        });
      }

      this.setState({
        selectedModes: newModes
      });
    }
  };

  transitModeChangeHandler = id => {
    const { selectedModes } = this.state;
    this.toggleSubmode("mode", id, selectedModes, isTransit, newModes => {
      this.setState({
        selectedModes: newModes,
        lastTransitModes: newModes.filter(isTransit)
      });
    });
  };

  companiesChangeHandler = id => {
    const { selectedCompanies } = this.state;
    this.toggleSubmode(
      "companies",
      id,
      selectedCompanies,
      undefined,
      newCompanies => {
        this.setState({
          selectedCompanies: newCompanies
        });
      }
    );
  };

  queryParamChangeHandler = queryParam => {
    const { onQueryParamChange } = this.props;
    if (typeof onQueryParamChange === "function") {
      onQueryParamChange(queryParam);
    }
  };

  toggleSubmode = (name, id, submodes, filter = o => o, after) => {
    const newSubmodes = [].concat(submodes);
    const idx = newSubmodes.indexOf(id);

    // If the clicked mode is selected, then unselect it, o/w select it.
    // Leave at least one selected, as in newplanner.trimet.org.
    if (idx >= 0) {
      const subset = newSubmodes.filter(filter);
      if (subset.length >= 2) {
        newSubmodes.splice(idx, 1);
      }
    } else {
      newSubmodes.push(id);
    }

    if (newSubmodes.length !== submodes.length) {
      const { onQueryParamChange } = this.props;
      if (typeof onQueryParamChange === "function") {
        onQueryParamChange({
          [name]: newSubmodes.join(",")
        });
      }

      if (after) after(newSubmodes);
    }
  };

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
    const bicycleModeOptions = getBicycleModeOptions(
      commonModes,
      selectedModes
    );

    const queriedModes = {
      mode: selectedModes.join(","),
      routingType: "ITINERARY"
    };

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

        {/* The bike trip type selector */}
        {selectedModes.some(isBike) && !selectedModes.some(isTransit) && (
          <div>
            <div className="setting-label" style={{ float: "left" }}>
              Use:
            </div>
            <SubmodeSelector
              style={{ textAlign: "right" }}
              modes={bicycleModeOptions}
              onChange={this.mainModeChangeHandler}
            />
          </div>
        )}

        <GeneralSettingsPanel
          query={queriedModes}
          onQueryParamChange={this.queryParamChangeHandler}
        />
      </div>
    );
  }
}

ModeSelectorPanel.propTypes = {
  /**
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  /**
   * Triggered when a query parameter is changed.
   * @param params An object that contains the new values for the parameter(s) that has (have) changed.
   */
  onQueryParamChange: PropTypes.func,
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
  onQueryParamChange: null,
  selectedCompanies: null,
  selectedModes: null
};
