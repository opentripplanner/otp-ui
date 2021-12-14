import coreUtils from "@opentripplanner/core-utils";
import CSS from "csstype";
import React, { ReactElement, useCallback } from "react";

import CheckboxSelector from "../CheckboxSelector";
import DropdownSelector from "../DropdownSelector";
import * as S from "../styled";

// eslint-disable-next-line prettier/prettier
import type { ConfiguredModes, QueryParamChangeEvent, QueryParamOptions } from "../types";

interface GeneralSettingsPanelProps {
  /**
   * The CSS class name to apply to this element.
   */
  className?: string;
  /**
   * An object {parameterName: value, ...} whose attributes correspond to query parameters.
   * For query parameter names and value formats,
   * see https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/__tests__/query.js#L14
   */
  // Disable type check because the only use of queryParams is to be passed to
  // method getQueryParamProperty from "@opentripplanner/core-utils/query".
  // eslint-disable-next-line react/forbid-prop-types
  query?: any;
  /**
   * An optional object that defines customizations for certain query parameters
   * to change the label or list of options (both text and values) displayed for the desired parameters.
   * Customizations can be as few or as many as needed.
   * For a given parameter, default values from core-utils are used if no customization is provided.
   * If custom options are provided for a parameter, only those provided will be displayed.
   *
   * For query parameter names and value formats,
   * see https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/__tests__/query.js#L14
   */
  queryParamMessages?: {
    [key: string]: string | QueryParamOptions[];
  };
  /**
   * An array of parameter names to support in the settings panel.
   * See the `query` parameter for more on query parameter names.
   */
  paramNames?: string[];
  /**
   * Triggered when the value of a trip setting is changed by the user.
   * @param arg The data {name: value} of the changed trip setting.
   */
  onQueryParamChange?: (e: QueryParamChangeEvent) => void;
  /**
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
  /**
   * An array of supported modes that will be displayed as options.
   */
  supportedModes: ConfiguredModes;
}

/**
 * The general settings panel for setting speed and routing optimization controls.
 */
export default function GeneralSettingsPanel({
  className = null,
  onQueryParamChange = null,
  paramNames = coreUtils.query.defaultParams,
  query = null,
  queryParamMessages = null,
  style,
  supportedModes
}: GeneralSettingsPanelProps): ReactElement {
  const handleChange = useCallback(
    (queryParam: QueryParamChangeEvent) => {
      if (typeof onQueryParamChange === "function") {
        onQueryParamChange(queryParam);
      }
    },
    [onQueryParamChange]
  );

  const configWrapper = { modes: supportedModes };

  return (
    <S.GeneralSettingsPanel className={className} style={style}>
      {paramNames.map(param => {
        const paramInfo = coreUtils.queryParams
          .getCustomQueryParams(queryParamMessages)
          .find(qp => qp.name === param);
        // Check that the parameter applies to the specified routingType
        if (!paramInfo.routingTypes.includes(query.routingType)) return null;

        // Check that the applicability test (if provided) is satisfied
        if (
          typeof paramInfo.applicable === "function" &&
          !paramInfo.applicable(query, configWrapper)
        ) {
          return null;
        }

        const label = coreUtils.query.getQueryParamProperty(
          paramInfo,
          "label",
          query
        );
        const icon = coreUtils.query.getQueryParamProperty(
          paramInfo,
          "icon",
          query
        );

        // Create the UI component based on the selector type
        switch (paramInfo.selector) {
          case "DROPDOWN":
            return (
              <DropdownSelector
                key={paramInfo.name}
                name={paramInfo.name}
                value={query[paramInfo.name] || paramInfo.default}
                label={label}
                options={coreUtils.query.getQueryParamProperty(
                  paramInfo,
                  "options",
                  query
                )}
                onChange={this.handleChange}
              />
            );
          case "CHECKBOX":
            return (
              <CheckboxSelector
                key={paramInfo.label}
                name={paramInfo.name}
                value={query[paramInfo.name]}
                label={
                  <>
                    {icon}
                    {label}
                  </>
                }
                onChange={handleChange}
              />
            );
          default:
            return null;
        }
      })}
    </S.GeneralSettingsPanel>
  );
}
