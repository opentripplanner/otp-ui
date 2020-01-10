import React, { Component } from "react";
import PropTypes from "prop-types";
import queryParams from "@opentripplanner/core-utils/lib/query-params";
import {
  defaultParams,
  getQueryParamProperty
} from "@opentripplanner/core-utils/lib/query";
import { queryType } from "@opentripplanner/core-utils/lib/types";

import CheckboxSelector from "../CheckboxSelector";
import DropdownSelector from "../DropdownSelector";
import commonModes from "../__mocks__/modes"; // FIXME: Replace with ref to configuration.

/**
 * The general settings panel for setting speed and routing optimization controls.
 */
class GeneralSettingsPanel extends Component {
  onChangeHandler = queryParam => {
    const { onQueryParamChange } = this.props;

    if (typeof onQueryParamChange === "function") {
      onQueryParamChange(queryParam);
    }
  };

  render() {
    const { className, paramNames, query, style /* , config */ } = this.props;
    const configWrapper = { modes: commonModes };

    return (
      <div className={className} style={style}>
        {paramNames.map(param => {
          const paramInfo = queryParams.find(qp => qp.name === param);
          // Check that the parameter applies to the specified routingType
          if (!paramInfo.routingTypes.includes(query.routingType)) return null;

          // Check that the applicability test (if provided) is satisfied
          if (
            typeof paramInfo.applicable === "function" &&
            !paramInfo.applicable(query, configWrapper)
          ) {
            return null;
          }

          // Create the UI component based on the selector type
          switch (paramInfo.selector) {
            case "DROPDOWN":
              return (
                <DropdownSelector
                  key={paramInfo.name}
                  name={paramInfo.name}
                  value={query[paramInfo.name] || paramInfo.default}
                  label={getQueryParamProperty(paramInfo, "label", query)}
                  options={getQueryParamProperty(paramInfo, "options", query)}
                  onChange={this.onChangeHandler}
                />
              );
            case "CHECKBOX":
              return (
                <CheckboxSelector
                  key={paramInfo.label}
                  name={paramInfo.name}
                  value={query[paramInfo.name]}
                  label={getQueryParamProperty(paramInfo, "label", query)}
                  onChange={this.onChangeHandler}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }
}

GeneralSettingsPanel.propTypes = {
  /**
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  /**
   * An object {parameterName: value, ...} whose attributes correspond to query parameters.
   * For query parameter names and value formats,
   * see https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/query-params.js#L65
   */
  query: queryType,
  /**
   * An array of parameter names to support in the settings panel.
   * See the `query` parameter for more on query parameter names.
   */
  paramNames: PropTypes.arrayOf(PropTypes.string),
  /**
   * Triggered when the value of a trip setting is changed by the user.
   * @param arg The data {name: value} of the changed trip setting.
   */
  onQueryParamChange: PropTypes.func
};

GeneralSettingsPanel.defaultProps = {
  className: null,
  query: null,
  paramNames: defaultParams,
  onQueryParamChange: null
};

export default GeneralSettingsPanel;
