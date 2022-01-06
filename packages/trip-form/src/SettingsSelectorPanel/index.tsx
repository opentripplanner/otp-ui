// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import CSS from "csstype";
import flatten from "flat";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { TriMetModeIcon } from "@opentripplanner/icons";
import React, { ReactElement, useCallback, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

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
  CustomQueryParameters,
  ModeIconType,
  QueryParamChangeEvent
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
  queryParamMessages?: CustomQueryParameters;
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

/**
 * Gets a list of duration options.
 */
function getDurationOptions(intl, minuteOptions) {
  // intl is needed because <FormattedMessage> can't be used inside <option>.
  return minuteOptions.map(minutes => ({
    text: minutes === 60
      ? intl.formatNumber(1, {
        style: "unit",
        unit: "hour",
        unitDisplay: "long"
      })
      : intl.formatNumber(minutes, {
        style: "unit",
        unit: "minute",
        unitDisplay: "long"
      }),
    value: minutes
  }));
}

const METERS_PER_MILE = 1609;
const SECONDS_PER_HOUR = 3600;
/**
 * Gets a list of distance options in miles.
 */
function getDistanceOptionsInMiles(intl, mileOptions) {
  // intl is needed because <FormattedMessage> can't be used inside <option>.
  return mileOptions.map(miles => ({
    text: intl.formatMessage({
      defaultMessage: `${miles} miles`,
      description: "Displays a distance in miles",
      id: "otpUi.queryParameters.distanceInMiles"
    },
    {
      // 1 mile = 100 "centimiles". Pass that so that formatjs can pick up
      // English exceptions for 1/10 mile, 1/4 mile, etc.
      // (Decimal numbers don't work for the case selector.)
      centimiles: miles * 100,
      miles
    }),
    value: miles * METERS_PER_MILE
  }));
}

/**
 * Gets a list of speed options in miles per hour.
 */
function getSpeedOptionsInMilesPerHour(intl, milesPerHourOptions) {
  // intl is needed because <FormattedMessage> can't be used inside <option>.
  return milesPerHourOptions.map(mph => ({
    text: intl.formatMessage({
      defaultMessage: `${mph} mph`,
      description: "Displays a speed in miles per hour",
      id: "otpUi.queryParameters.speedInMilesPerHour"
    },
    {
      mph
    }),
    value: (mph * METERS_PER_MILE / SECONDS_PER_HOUR).toFixed(2)
  }));
}

/**
 * Obtains a set of custom query parameters with localized labels and options.
 */
function getQueryParamMessagesWithI18n(intl: IntlShape): CustomQueryParameters {
  return {
    maxWalkDistance: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.maxWalkDistance"]}
          description="Max walk distance label"
          id="otpUi.queryParameters.maxWalkDistance"
        />
      ),
      options: getDistanceOptionsInMiles(intl, [0.10, 0.25, 0.5, 0.75, 1, 2, 5])
    },
    maxBikeDistance: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.maxBikeDistance"]}
          description="Max bike distance label"
          id="otpUi.queryParameters.maxBikeDistance"
        />
      ),
      options: getDistanceOptionsInMiles(intl, [0.25, 0.5, 0.75, 1, 2, 3, 5, 10, 20, 30])
    },
    optimize: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.optimizeFor"]}
          description="Optimize selector label"
          id="otpUi.queryParameters.optimizeFor"
        />
      ),
      options: [
        {
          text: intl.formatMessage({
            defaultMessage: defaultMessages["otpUi.queryParameters.optimizeQuick"],
            description: "Option label for quickest trips",
            id: "otpUi.queryParameters.optimizeQuick"
          }),
          value: "QUICK"
        },
        {
          text: intl.formatMessage({
            defaultMessage: defaultMessages["otpUi.queryParameters.optimizeTransfers"],
            description: "Option label for fewest transfers",
            id: "otpUi.queryParameters.optimizeTransfers"
          }),
          value: "TRANSFERS"
        }
      ]
    },
    optimizeBike: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.optimizeFor"]}
          description="Optimize selector label"
          id="otpUi.queryParameters.optimizeFor"
        />
      )
      // TODO: options (TRICKY)
    },
    maxWalkTime: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.maxWalkTime"]}
          description="Max walk time label"
          id="otpUi.queryParameters.maxWalkTime"
        />
      ),
      options: getDurationOptions(intl, [5, 10, 15, 20, 30, 45, 60])
    },
    walkSpeed: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.walkSpeed"]}
          description="Max walk speed label"
          id="otpUi.queryParameters.walkSpeed"
        />
      ),
      options: getSpeedOptionsInMilesPerHour(intl, [2, 3, 4])
    },
    maxBikeTime: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.maxBikeTime"]}
          description="Max bike time label"
          id="otpUi.queryParameters.maxBikeTime"
        />
      ),
      options: getDurationOptions(intl, [5, 10, 15, 20, 30, 45, 60])
    },
    bikeSpeed: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.bikeSpeed"]}
          description="Bike speed selector label"
          id="otpUi.queryParameters.bikeSpeed"
        />
      ),
      options: getSpeedOptionsInMilesPerHour(intl, [6, 8, 10, 12])
    },
    maxEScooterDistance: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.maxEScooterDistance"]}
          description="Max e-scooter distance label"
          id="otpUi.queryParameters.maxEScooterDistance"
        />
      ),
      options: getDistanceOptionsInMiles(intl, [0.25, 0.5, 0.75, 1, 2, 3, 5, 10, 20, 30])
    },
    watts: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.watts"]}
          description="E-scooter power label"
          id="otpUi.queryParameters.watts"
        />
      ),
      options: [
        {
          text: intl.formatMessage({
            defaultMessage: defaultMessages["otpUi.queryParameters.watts125kidsHoverboard"],
            description: "Label for a kid's e-scooter",
            id: "otpUi.queryParameters.watts125kidsHoverboard"
          }),
          value: 125
        },
        {
          text: intl.formatMessage({
            defaultMessage: defaultMessages["otpUi.queryParameters.watts250entryLevelEscooter"],
            description: "Label for an entry-level e-scooter",
            id: "otpUi.queryParameters.watts250entryLevelEscooter"
          }),
          value: 250
        },
        {
          text: intl.formatMessage({
            defaultMessage: defaultMessages["otpUi.queryParameters.watts500robustEscooter"],
            description: "Label for a robust e-scooter",
            id: "otpUi.queryParameters.watts500robustEscooter"
          }),
          value: 500
        },
        {
          text: intl.formatMessage({
            defaultMessage: defaultMessages["otpUi.queryParameters.watts1500powerfulEscooter"],
            description: "Label for a powerful e-scooter",
            id: "otpUi.queryParameters.watts1500powerfulEscooter"
          }),
          value: 1500
        }
      ]
    },
    wheelchair: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.wheelchair"]}
          description="Label for wheelchair option"
          id="otpUi.queryParameters.wheelchair"
        />
      )
    }
  }
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
  const queryParamMessagesWithI18n = queryParamMessages || getQueryParamMessagesWithI18n(intl)

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
        queryParamMessages={queryParamMessagesWithI18n}
        supportedModes={supportedModes}
        onQueryParamChange={handleQueryParamChange}
      />
    </S.SettingsSelectorPanel>
  );
}
