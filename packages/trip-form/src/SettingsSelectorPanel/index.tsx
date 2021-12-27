// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import CSS from "csstype";
import flatten from "flat";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { TriMetModeIcon } from "@opentripplanner/icons";
import React, { ReactElement, useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ModeSelector from "../ModeSelector";
import SubmodeSelector from "../SubmodeSelector";
import GeneralSettingsPanel from "../GeneralSettingsPanel";
import * as S from "../styled";
import {
  getModeOptions,
  getTransitSubmodeOptions,
  getCompaniesForModeId,
  getCompaniesOptions,
  getBicycleOrMicromobilityModeOptions,
  getModeString,
  isBike
} from "../util";
// eslint-disable-next-line prettier/prettier
import type {
  ConfiguredCompany,
  ConfiguredModes,
  ModeIconType,
  QueryParamChangeEvent,
  QueryParamOptions
} from "../types";

// Load the default messages.
import defaultEnglishMessages from "../../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

const { isMicromobility, isTransit } = coreUtils.itinerary;

// FIXME: merge with the other QueryParams
interface QueryParams {
  [key: string]: string;
}

interface SettingsSelectorPanelProps {
  /**
   * The CSS class name to apply to this element.
   */
  className?: string;
  /**
   * The icon component for rendering mode icons. Defaults to the OTP-UI TriMetModeIcon component.
   */
  ModeIcon?: ModeIconType;
  /**
   * Triggered when a query parameter is changed.
   * @param params An object that contains the new values for the parameter(s) that has (have) changed.
   */
  onQueryParamChange?: (evt: QueryParamChangeEvent) => void;
  /**
   * An object {parameterName: value, ...} whose attributes correspond to query parameters.
   * For query parameter names and value formats,
   * see https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/__tests__/query.js#L14
   */
  queryParams?: QueryParams;
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
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
  /**
   * An array of supported companies that will be displayed as options where applicable.
   */
  supportedCompanies?: ConfiguredCompany[];
  /**
   * Supported modes that will be displayed as primary, secondary, tertiary options.
   */
  supportedModes: ConfiguredModes;
}

function getSelectedCompanies(queryParams: QueryParams) {
  const { companies } = queryParams;
  return companies ? companies.split(",") : [];
}

function getSelectedModes(queryParams: QueryParams) {
  const { mode } = queryParams;
  const modes = mode ? mode.split(",") : [];

  // Map OTP Flex modes to custom flex mode
  return coreUtils.query.reduceOtpFlexModes(modes);
}

/**
 * The Settings Selector Panel allows the user to set trip search preferences,
 * such as modes, providers, and speed preferences.
 */
export default function SettingsSelectorPanel({
  className = null,
  ModeIcon = TriMetModeIcon,
  onQueryParamChange = null,
  queryParams = null,
  queryParamMessages = null,
  style = null,
  supportedCompanies = [],
  supportedModes = null
}: SettingsSelectorPanelProps): ReactElement {
  const [defaultAccessModeCompany, setDefaultAccessModeCompany] = useState(null);
  const [lastTransitModes, setLastTransitModes] = useState([]);

  const selectedModes = getSelectedModes(queryParams);
  const selectedCompanies = getSelectedCompanies(queryParams);

  const handleQueryParamChange = useCallback(
    (queryParam: QueryParamChangeEvent) => {
      if (typeof onQueryParamChange === "function") {
        onQueryParamChange(queryParam);
      }
    },
    [onQueryParamChange]
  );

  const toggleSubmode = useCallback(
    (name, id, submodes, filter = o => o, after) => {
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
        handleQueryParamChange({
          [name]: newSubmodes.join(",")
        });
        if (after) after(newSubmodes);
      }
    },
    [onQueryParamChange]
  );

  const handleMainModeChange = useCallback(
    (id: string) => {
      const newModes = id.split("+");

      if (newModes[0] === "TRANSIT") {
        const activeTransitModes = selectedModes.filter(isTransit);

        const lastOrAllTransitModes = lastTransitModes.length === 0
          ? supportedModes.transitModes
            .map(getModeString)
          : lastTransitModes;
        
        const {
          defaultAccessModeCompany: defAccessModeCompany,
          companies,
          nonTransitModes
        } = getCompaniesForModeId(id, supportedCompanies);

        // Add previously selected transit modes only if none were active.
        const finalModes = (activeTransitModes.length > 0
          ? activeTransitModes
          : lastOrAllTransitModes
        ).concat(nonTransitModes);

        handleQueryParamChange({
          companies: companies.join(","),
          mode: finalModes.join(",")
        });

        setDefaultAccessModeCompany(defAccessModeCompany && defAccessModeCompany[0]);
      } else {
        handleQueryParamChange({
          companies: "", // New req: Don't list companies with this mode?
          mode: newModes.join(",")
        });
      }
    },
    [onQueryParamChange, queryParams, lastTransitModes]
  );

  const handleTransitModeChange = useCallback(
    (id: string) => toggleSubmode(
      "mode",
      id,
      selectedModes,
      isTransit,
      newModes => setLastTransitModes(newModes.filter(isTransit))
    ),
    [onQueryParamChange, queryParams]
  );

  const handleCompanyChange = useCallback(
    (id: string) => toggleSubmode("companies", id, selectedCompanies, undefined, () => {}),
    [onQueryParamChange, queryParams]
  );

  const intl = useIntl();

  const modeOptions = getModeOptions(
    ModeIcon,
    supportedModes,
    selectedModes,
    selectedCompanies,
    supportedCompanies,
    intl,
    defaultMessages
  );
  const transitModes = getTransitSubmodeOptions(
    ModeIcon,
    supportedModes,
    selectedModes
  );
  const nonTransitModes = selectedModes.filter(m => !isTransit(m));
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

  const submodeLabel = (
    <FormattedMessage
      defaultMessage={defaultMessages["otpUi.SettingsSelectorPanel.use"]}
      description="Text announcing a list of submodes to use."
      id="otpUi.SettingsSelectorPanel.use"
    />
  );
  const submodeCompaniesLabel = (
    <FormattedMessage
      defaultMessage={defaultMessages["otpUi.SettingsSelectorPanel.useCompanies"]}
      description="Text announcing a list of rental companies to use."
      id="otpUi.SettingsSelectorPanel.useCompanies"
    />
  );

  return (
    <S.SettingsSelectorPanel className={className} style={style}>
      <ModeSelector
        modes={modeOptions}
        onChange={handleMainModeChange}
        style={{ margin: "0px -5px", paddingBottom: "8px" }}
      />

      <S.SettingsHeader>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.SettingsSelectorPanel.travelPreferences"]}
          description="Header text for the travel preferences."
          id="otpUi.SettingsSelectorPanel.travelPreferences"
        />
      </S.SettingsHeader>

      {selectedModes.some(isTransit) &&
        transitModes.length >= 2 && (
          <SubmodeSelector
            label={submodeLabel}
            modes={transitModes}
            onChange={handleTransitModeChange}
          />
        )}

      {/* The bike trip type selector */}
      {/* TODO: Handle different bikeshare networks */}
      {selectedModes.some(isBike) &&
        !selectedModes.some(isTransit) && (
          <SubmodeSelector
            label={submodeLabel}
            inline
            modes={bikeModes}
            onChange={handleMainModeChange}
          />
        )}

      {/* The micromobility trip type selector */}
      {/* TODO: Handle different micromobility networks */}
      {selectedModes.some(isMicromobility) &&
        !selectedModes.some(isTransit) && (
          <SubmodeSelector
            label={submodeLabel}
            inline
            modes={scooterModes}
            onChange={handleMainModeChange}
          />
        )}

      {/* This order is probably better. */}
      {companies.length >= 2 && (
        <SubmodeSelector
          label={submodeCompaniesLabel}
          modes={companies}
          onChange={handleCompanyChange}
        />
      )}

      <GeneralSettingsPanel
        query={queryParams}
        queryParamMessages={queryParamMessages}
        supportedModes={supportedModes}
        onQueryParamChange={handleQueryParamChange}
      />
    </S.SettingsSelectorPanel>
  );
}
