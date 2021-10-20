import coreUtils from "@opentripplanner/core-utils";
import { TriMetModeIcon } from "@opentripplanner/icons";
import React, { Component } from "react";
import PropTypes from "prop-types";

import ModeSelector from "../ModeSelector";
import SubmodeSelector from "../SubmodeSelector";
import GeneralSettingsPanel from "../GeneralSettingsPanel";
import * as Styled from "../styled";
import {
  getModeOptions,
  getTransitSubmodeOptions,
  getCompaniesForModeId,
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
    const modes = mode ? mode.split(",") : [];

    // Map OTP Flex modes to custom flex mode
    return modes.reduce((prev, cur) => {
      const newModes = prev;
      // Add the current mode if it is not a flex mode
      if (!cur.includes("FLEX")) {
        newModes.push(cur);
        // If it is a flex mode, do not add it but rather add the custom flex mode
        // if not already present
      } else if (!newModes.includes("FLEX")) {
        newModes.push("FLEX");
      }
      return newModes;
    }, []);
  }

  makeNewQueryParams = queryParam => {
    const { queryParams } = this.props;
    return { ...queryParams, ...queryParam };
  };

  raiseOnQueryParamChange = queryParam => {
    const { onQueryParamChange } = this.props;
    if (typeof onQueryParamChange === "function") {
      onQueryParamChange(queryParam);
    }
  };

  handleMainModeChange = id => {
    const { supportedModes, supportedCompanies } = this.props;
    const newModes = id.split("+");

    if (newModes[0] === "TRANSIT") {
      const selectedModes = this.getSelectedModes();
      const activeTransitModes = selectedModes.filter(
        coreUtils.itinerary.isTransit
      );

      let { lastTransitModes } = this.state;
      if (lastTransitModes.length === 0) {
        const allTransitModes = supportedModes.transitModes.map(
          modeObj => modeObj.mode
        );

        lastTransitModes = lastTransitModes.concat(allTransitModes);
      }

      const {
        defaultAccessModeCompany,
        companies,
        nonTransitModes
      } = getCompaniesForModeId(id, supportedCompanies);

      // Add previously selected transit modes only if none were active.
      const finalModes = (activeTransitModes.length > 0
        ? activeTransitModes
        : lastTransitModes
      ).concat(nonTransitModes);

      this.handleQueryParamChange({
        mode: finalModes.join(","),
        companies: companies.join(",")
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
    this.toggleSubmode(
      "mode",
      id,
      selectedModes,
      coreUtils.itinerary.isTransit,
      newModes => {
        this.setState({
          lastTransitModes: newModes.filter(coreUtils.itinerary.isTransit)
        });
      }
    );
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
      ModeIcon,
      queryParams,
      supportedModes,
      supportedCompanies,
      style
    } = this.props;
    const { defaultAccessModeCompany } = this.state;
    const selectedModes = this.getSelectedModes();
    const selectedCompanies = this.getSelectedCompanies();

    const modeOptions = getModeOptions(
      ModeIcon,
      supportedModes,
      selectedModes,
      selectedCompanies,
      supportedCompanies
    );
    const transitModes = getTransitSubmodeOptions(
      ModeIcon,
      supportedModes,
      selectedModes
    );
    const nonTransitModes = selectedModes.filter(
      m => !coreUtils.itinerary.isTransit(m)
    );
    const companies = getCompaniesOptions(
      supportedCompanies.filter(comp =>
        defaultAccessModeCompany ? comp.id === defaultAccessModeCompany : true
      ),
      nonTransitModes,
      selectedCompanies
    );
    const bikeModes = getBicycleOrMicromobilityModeOptions(
      ModeIcon,
      supportedModes.bicycleModes,
      selectedModes
    );
    const scooterModes = getBicycleOrMicromobilityModeOptions(
      ModeIcon,
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

        {selectedModes.some(coreUtils.itinerary.isTransit) &&
          transitModes.length >= 2 && (
            <SubmodeSelector
              label="Use"
              modes={transitModes}
              onChange={this.handleTransitModeChange}
            />
          )}

        {/* The bike trip type selector */}
        {/* TODO: Handle different bikeshare networks */}
        {selectedModes.some(isBike) &&
          !selectedModes.some(coreUtils.itinerary.isTransit) && (
            <SubmodeSelector
              label="Use"
              inline
              modes={bikeModes}
              onChange={this.handleMainModeChange}
            />
          )}

        {/* The micromobility trip type selector */}
        {/* TODO: Handle different micromobility networks */}
        {selectedModes.some(coreUtils.itinerary.isMicromobility) &&
          !selectedModes.some(coreUtils.itinerary.isTransit) && (
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
   * The icon component for rendering mode icons. Defaults to the OPT-UI TriMetModeIcon component.
   */
  ModeIcon: PropTypes.elementType,
  /**
   * Triggered when a query parameter is changed.
   * @param params An object that contains the new values for the parameter(s) that has (have) changed.
   */
  onQueryParamChange: PropTypes.func,
  /**
   * An object {parameterName: value, ...} whose attributes correspond to query parameters.
   * For query parameter names and value formats,
   * see https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/__tests__/query.js#L14
   */
  // Disable type check because the only use of queryParams is to be passed to
  // method getQueryParamProperty from "@opentripplanner/core-utils/query".
  // eslint-disable-next-line react/forbid-prop-types
  queryParams: PropTypes.any,
  /**
   * An array of supported companies that will be displayed as options where applicable.
   */
  supportedCompanies: PropTypes.arrayOf(coreUtils.types.configuredCompanyType),
  /**
   * An array of supported modes that will be displayed as options.
   */
  supportedModes: coreUtils.types.configuredModesType.isRequired
};

SettingsSelectorPanel.defaultProps = {
  className: null,
  ModeIcon: TriMetModeIcon,
  onQueryParamChange: null,
  queryParams: null,
  supportedCompanies: []
};
