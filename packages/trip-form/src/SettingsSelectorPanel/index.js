import React, { Component } from "react";
import PropTypes from "prop-types";
import { callIfValid } from "@opentripplanner/core-utils/lib/functions";
import {
  isMicromobility,
  isTransit
} from "@opentripplanner/core-utils/lib/itinerary";
import {
  configuredCompanyType,
  configuredModesType,
  queryType
} from "@opentripplanner/core-utils/lib/types";

import ModeSelector from "../ModeSelector";
import SubmodeSelector from "../SubmodeSelector";
import GeneralSettingsPanel from "../GeneralSettingsPanel";
import * as Styled from "../styled";
import {
  getModeOptions,
  getTransitSubmodeOptions,
  getCompanies,
  getCompaniesOptions,
  getBicycleOrMicromobilityModeOptions,
  isBike
} from "../util";

/**
 * The Settings Selector Panel allows the user to set trip search preferences,
 * such as modes, providers, and speed preferences.
 */
export default class SettingsSelectorPanel extends Component {
  constructor() {
    super();

    this.state = {
      defaultAccessModeCompany: null,
      lastTransitModes: []
    };
  }

  getSelectedCompanies() {
    const { queryParams } = this.props;
    const { companies } = queryParams;
    return companies ? companies.split(",") : [];
  }

  getSelectedModes() {
    const { queryParams } = this.props;
    const { mode } = queryParams;
    return mode ? mode.split(",") : [];
  }

  makeNewQueryParams = queryParam => {
    const { queryParams } = this.props;
    return { ...queryParams, ...queryParam };
  };

  raiseOnQueryParamChange = queryParam => {
    const { onQueryParamChange } = this.props;
    callIfValid(onQueryParamChange)(queryParam);
  };

  handleMainModeChange = id => {
    const { supportedModes, supportedCompanies } = this.props;
    const newModes = id.split("+");

    if (newModes[0] === "TRANSIT") {
      const selectedModes = this.getSelectedModes();
      const activeTransitModes = selectedModes.filter(isTransit);

      let { lastTransitModes } = this.state;
      if (lastTransitModes.length === 0) {
        const allTransitModes = supportedModes.transitModes.map(
          modeObj => modeObj.mode
        );

        lastTransitModes = lastTransitModes.concat(allTransitModes);
      }

      const nonTransitModes = newModes.length > 1 ? [newModes[1]] : ["WALK"]; // TODO: also accommodate WALK+DRIVE, WALK+e-scooter?? They already seem to work without WALK right now.
      const defaultAccessModeCompany =
        newModes.length > 2 ? [newModes[2]] : null; // To accommodate companies defined under accessModes.

      // Add previously selected transit modes only if none were active.
      const finalModes = (activeTransitModes.length > 0
        ? activeTransitModes
        : lastTransitModes
      ).concat(nonTransitModes);

      // If there are multiple (scooter | bikeshare) providers,
      // then if one is specified by the mode button, select it,
      // othewise select all providers.
      // selectedCompanies is at least an empty array.
      const selectedCompanies =
        defaultAccessModeCompany ||
        getCompanies(supportedCompanies, nonTransitModes).map(comp => comp.id);

      this.handleQueryParamChange({
        mode: finalModes.join(","),
        companies: selectedCompanies.join(",")
      });

      this.setState({
        defaultAccessModeCompany:
          defaultAccessModeCompany && defaultAccessModeCompany[0]
      });
    } else {
      this.handleQueryParamChange({
        mode: newModes.join(","),
        companies: "" // New req: Don't list companies with this mode?
      });
    }
  };

  handleTransitModeChange = id => {
    const selectedModes = this.getSelectedModes();
    this.toggleSubmode("mode", id, selectedModes, isTransit, newModes => {
      this.setState({
        lastTransitModes: newModes.filter(isTransit)
      });
    });
  };

  handleCompanyChange = id => {
    const selectedCompanies = this.getSelectedCompanies();
    this.toggleSubmode("companies", id, selectedCompanies, undefined, () => {});
  };

  handleQueryParamChange = queryParam => {
    this.raiseOnQueryParamChange(queryParam);
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
      this.handleQueryParamChange({
        [name]: newSubmodes.join(",")
      });
      if (after) after(newSubmodes);
    }
  };

  render() {
    const {
      className,
      queryParams,
      supportedModes,
      supportedCompanies,
      style
    } = this.props;
    const { defaultAccessModeCompany } = this.state;
    const selectedModes = this.getSelectedModes();

    const modeOptions = getModeOptions(supportedModes, selectedModes);
    const transitModes = getTransitSubmodeOptions(
      supportedModes,
      selectedModes
    );
    const nonTransitModes = selectedModes.filter(m => !isTransit(m));
    const companies = getCompaniesOptions(
      supportedCompanies.filter(comp =>
        defaultAccessModeCompany ? comp.id === defaultAccessModeCompany : true
      ),
      nonTransitModes,
      this.getSelectedCompanies()
    );
    const bikeModes = getBicycleOrMicromobilityModeOptions(
      supportedModes.bicycleModes,
      selectedModes
    );
    const scooterModes = getBicycleOrMicromobilityModeOptions(
      supportedModes.micromobilityModes,
      selectedModes
    );

    return (
      <Styled.SettingsSelectorPanel className={className} style={style}>
        <ModeSelector
          modes={modeOptions}
          onChange={this.handleMainModeChange}
          style={{ margin: "0px -5px", paddingBottom: "8px" }}
        />

        <Styled.SettingsHeader>Travel Preferences</Styled.SettingsHeader>

        {selectedModes.some(isTransit) && transitModes.length >= 2 && (
          <SubmodeSelector
            label="Use"
            modes={transitModes}
            onChange={this.handleTransitModeChange}
          />
        )}

        {/* The bike trip type selector */}
        {/* TODO: Handle different bikeshare networks */}
        {selectedModes.some(isBike) && !selectedModes.some(isTransit) && (
          <SubmodeSelector
            label="Use"
            inline
            modes={bikeModes}
            onChange={this.handleMainModeChange}
          />
        )}

        {/* The micromobility trip type selector */}
        {/* TODO: Handle different micromobility networks */}
        {selectedModes.some(isMicromobility) &&
          !selectedModes.some(isTransit) && (
            <SubmodeSelector
              label="Use"
              inline
              modes={scooterModes}
              onChange={this.handleMainModeChange}
            />
          )}

        {/* This order is probably better. */}
        {companies.length >= 2 && (
          <SubmodeSelector
            label="Use companies"
            modes={companies}
            onChange={this.handleCompanyChange}
          />
        )}

        <GeneralSettingsPanel
          query={queryParams}
          supportedModes={supportedModes}
          onQueryParamChange={this.handleQueryParamChange}
        />
      </Styled.SettingsSelectorPanel>
    );
  }
}

SettingsSelectorPanel.propTypes = {
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
   * An object {parameterName: value, ...} whose attributes correspond to query parameters.
   * For query parameter names and value formats,
   * see https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/query-params.js#L65
   */
  queryParams: queryType,
  /**
   * An array of supported companies that will be displayed as options where applicable.
   */
  supportedCompanies: PropTypes.arrayOf(configuredCompanyType),
  /**
   * An array of supported modes that will be displayed as options.
   */
  supportedModes: configuredModesType.isRequired
};

SettingsSelectorPanel.defaultProps = {
  className: null,
  onQueryParamChange: null,
  queryParams: null,
  supportedCompanies: []
};
