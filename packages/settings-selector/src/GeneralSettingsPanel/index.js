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
          )
            return null;

          // Create the UI component based on the selector type
          switch (paramInfo.selector) {
            case "DROPDOWN":
              return (
                <DropdownSelector
                  key={paramInfo.name}
                  name={paramInfo.name}
                  value={query[paramInfo.name]}
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
  className: PropTypes.string,
  query: queryType,
  paramNames: PropTypes.arrayOf(PropTypes.string),
  onQueryParamChange: PropTypes.func
};

GeneralSettingsPanel.defaultProps = {
  className: null,
  query: null,
  paramNames: defaultParams,
  onQueryParamChange: null
};

export default GeneralSettingsPanel;
