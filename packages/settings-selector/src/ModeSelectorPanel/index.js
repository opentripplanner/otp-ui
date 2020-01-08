import React, { Component } from "react";
import PropTypes from "prop-types";
import { isTransit } from "@opentripplanner/core-utils/lib/itinerary";
import { queryType } from "@opentripplanner/core-utils/lib/types";

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

    const { queryParams } = props;

    this.state = {
      defaultCompany: null,
      lastTransitModes: [],
      queryParams
    };
  }

  getNewQueryParams = queryParam => {
    const { queryParams } = this.state;
    return { ...queryParams, ...queryParam };
  };

  getSelectedCompanies() {
    const { queryParams } = this.state;
    const { companies } = queryParams;
    return companies ? companies.split(",") : [];
  }

  getSelectedModes() {
    const { queryParams } = this.state;
    const { mode } = queryParams;
    return mode ? mode.split(",") : [];
  }

  raiseOnQueryParamChange = queryParam => {
    const { onQueryParamChange } = this.props;
    if (typeof onQueryParamChange === "function") {
      onQueryParamChange(queryParam);
    }
  };

  mainModeChangeHandler = id => {
    const newModes = id.split("+");
    if (newModes[0] === "TRANSIT") {
      const selectedModes = this.getSelectedModes();
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

      this.queryParamChangeHandler({
        mode: finalModes.join(","),
        companies: selectedCompanies.join(",")
      });

      this.setState({
        defaultCompany: defaultCompany && defaultCompany[0]
      });
    } else {
      this.queryParamChangeHandler({
        mode: newModes.join(","),
        companies: "" // New req: Don't list companies with this mode?
      });
    }
  };

  transitModeChangeHandler = id => {
    const selectedModes = this.getSelectedModes();
    this.toggleSubmode("mode", id, selectedModes, isTransit, newModes => {
      this.setState({
        lastTransitModes: newModes.filter(isTransit)
      });
    });
  };

  companiesChangeHandler = id => {
    const selectedCompanies = this.getSelectedCompanies();
    this.toggleSubmode("companies", id, selectedCompanies, undefined, () => {});
  };

  queryParamChangeHandler = queryParam => {
    this.raiseOnQueryParamChange(queryParam);
    this.setState({
      queryParams: this.getNewQueryParams(queryParam)
    });
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
      this.queryParamChangeHandler({
        [name]: newSubmodes.join(",")
      });
      if (after) after(newSubmodes);
    }
  };

  render() {
    const { className, style } = this.props;
    const { defaultCompany, queryParams } = this.state;
    const selectedModes = this.getSelectedModes();
    const selectedCompanies = this.getSelectedCompanies();

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

    return (
      <div className={className} style={style}>
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
          query={queryParams}
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
   * An object whose attributes correspond to query parameters.
   */
  queryParams: queryType
};

ModeSelectorPanel.defaultProps = {
  className: null,
  onQueryParamChange: null,
  queryParams: null
};
