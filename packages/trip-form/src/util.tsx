import coreUtils from "@opentripplanner/core-utils";
import { getCompanyIcon } from "@opentripplanner/icons";
import React, { ElementType } from "react";

// eslint-disable-next-line prettier/prettier
import type {
  ConfiguredCompany,
  ConfiguredModes,
  FullModeOption,
  ModeOption,
  ModeSelectorOption,
  ModeSelectorOptionSet
} from "./types";

const {
  hasHail,
  hasRental,
  isBicycle,
  isBicycleRent,
  isMicromobility,
  isTransit,
  isWalk
} = coreUtils.itinerary;

export function isBike(mode: string): boolean {
  return isBicycle(mode) || isBicycleRent(mode);
}

const supportedExclusiveModes = [
  {
    mode: "WALK",
    label: "Walk Only",
    isActive: isWalk
  },
  {
    mode: "BICYCLE",
    label: "Bike Only",
    isActive: isBike
  },
  {
    mode: "MICROMOBILITY",
    label: "E-scooter Only",
    isActive: isMicromobility
  }
];

/**
 * Helper function so that TypeScript propagates the correct underlying type for ModeOption.
 */
export function isFullModeOption(modeOption: ModeOption): modeOption is FullModeOption {
  return typeof modeOption !== "string";
}

/**
 * Obtains the mode-as-a-string from a mode object found in the configuration.
 * In config.yaml, you can write either:
 *   transitModes:    -or-   transitModes:
 *   - BUS                   - mode: BUS
 *   - RAIL                    label: Bus
 *                           - mode: RAIL
 *                             label: Commuter Rail
 *
 * @param modeObj The mode object per the configuration to convert.
 */
export function getModeString(modeObj: ModeOption): string {
  return isFullModeOption(modeObj)
    ? modeObj.mode
    : modeObj;
}

/**
 * Of the specified companies, returns those that operate the specified modes.
 * @param companies The supported companies per OTP configuration.
 * @param modes The desired modes for which to get the operating companies.
 * @returns An array of companies that operate the specified modes (should not be undefined as companies is an array).
 */
function getCompanies(companies: ConfiguredCompany[], modes: string[]): ConfiguredCompany[] {
  return companies
    .filter(
      comp => comp.modes.split(",").filter(m => modes.includes(m)).length > 0
    )
    .filter(
      comp => hasRental(comp.modes) || hasHail(comp.modes)
    );
}

/**
 * Returns an array containing the company ids, in upper case for MOD UI URLs, for the specified mode id.
 * The mode id scheme is set and used by function getTransitCombinedModeOptions().
 * @param id The mode id to process.
 * @param supportedCompanies The list of supported companies (see structure in __mocks__/companies.js).
 */
export function getCompaniesForModeId(id: string, supportedCompanies: ConfiguredCompany[]): {
  defaultAccessModeCompany?: string[];
  companies: string[];
  nonTransitModes: string[];
} {
  const newModes = id.split("+");
  const nonTransitModes = newModes.length > 1 ? [newModes[1]] : ["WALK"];
  // TODO: for non-transit modes, should we also accommodate WALK+DRIVE, WALK+e-scooter??
  // They already seem to work without WALK right now.

  // Accommodate companies defined under accessModes.
  // Convert company ID to upper case for passing to MOD UI URL.
  const defaultAccessModeCompany =
    newModes.length > 2 ? [newModes[2].toUpperCase()] : null;

  // If there are multiple (scooter | bikeshare | etc.) companies,
  // then if one is specified in the configured modes, then use that company.
  // Otherwise, if this is for an exclusive mode (bike, scooter), then use all companies.
  // Convert company IDs to upper case for passing to MOD UI URL.
  // selectedCompanies is at least an empty array.
  const companies =
    defaultAccessModeCompany ||
    getCompanies(supportedCompanies, nonTransitModes).map(comp =>
      comp.id.toUpperCase()
    );

  return { defaultAccessModeCompany, companies, nonTransitModes };
}

/**
 * Returns the available transit modes (rail, bus, etc.).
 * @param ModeIcon The icon component for rendering.
 * @param modes The available modes to choose from.
 * @param selectedModes The modes that should appear selected.
 */
export function getTransitSubmodeOptions(
  ModeIcon: ElementType,
  modes: ConfiguredModes,
  selectedModes: string[]
): ModeSelectorOption[] {
  const { transitModes } = modes;

  // FIXME: If only one transit mode is available, select it.
  return transitModes.map((modeObj: ModeOption) => {
    const modeStr = getModeString(modeObj);
    const modeLabel: string = isFullModeOption(modeObj)
      ? modeObj.label
      : null;

    return {
      id: modeStr,
      selected: selectedModes.includes(modeStr),
      text: (
        <span>
          <ModeIcon mode={modeStr} />
          {modeLabel}
        </span>
      ),
      title: modeLabel
    };
  });
}

/**
 * Returns the big primary "Take Transit" choice.
 * @param ModeIcon The icon component for rendering.
 * @param selectedModes An array of string that lists the modes selected for a trip query.
 */
function getPrimaryModeOption(ModeIcon: ElementType, selectedModes: string[]): ModeSelectorOption {
  return {
    id: "TRANSIT",
    selected:
      selectedModes.some(isTransit) &&
      selectedModes.includes("WALK"),
    showTitle: false,
    text: (
      <span>
        <ModeIcon mode="TRANSIT" />
        Take Transit
      </span>
    ),
    title: "Take Transit"
  };
}

/**
 * Returns the transit + access mode combinations.
 * @param icons The icon set to use.
 * @param modes The available modes to choose from.
 * @param selectedModes An array of string that lists the modes selected for a trip query.
 * @param selectedCompanies The companies to show as selected.
 * @param supportedCompanies The supported companies for certain modes.
 */
function getTransitCombinedModeOptions(
  ModeIcon: ElementType,
  modes: ConfiguredModes,
  selectedModes: string[],
  selectedCompanies: string[],
  supportedCompanies: ConfiguredCompany[]
): ModeSelectorOption[] {
  const { accessModes } = modes;
  const modesHaveTransit = selectedModes.some(isTransit);

  return (
    accessModes &&
    accessModes.map((modeObj: ModeOption) => {
      const modeStr = getModeString(modeObj);
      const { company: modeCompany = null, label: modeLabel = null } = isFullModeOption(modeObj)
        ? modeObj
        : {};
      const modeCompanyUpper = modeCompany?.toUpperCase();

      const company = modeCompany ? `+${modeCompany}` : "";
      const id = `TRANSIT+${modeStr}${company}`;

      const { companies } = getCompaniesForModeId(id, supportedCompanies);
      const modeMonopoly = companies[0];
      const CompanyIcon = getCompanyIcon(modeCompanyUpper || modeMonopoly || "");

      /**
       * We don't know in advance if a particular icon is supported by the ModeIcon component.
       * Therefore, for rendering, we need to know whether one of the following
       * did render something, so we know whether to fall back on the next icon.
       * Hence the regular function call syntax rather than <Tags />.
       *
       * Access mode icons are processed in the order below, so that:
       * - Any generic mode (e.g. BICYCLE_RENT) can be directly customized using `icons`,
       * - Implementers can set icons for companies not in OTP-UI or override OTP-UI icons using `icons`,
       *   using the scheme <OTP_MODE>_<COMPANY> (e.g. 'CAR_HAIL_UBER').
       * - Icons for common companies (defined in the icons package) don't need to be specified in `icons`.
       */
      const finalIcon =
        <ModeIcon mode={modeStr} /> ||
        <ModeIcon mode={`${modeStr}_${modeCompanyUpper}`} /> ||
        (CompanyIcon && <CompanyIcon />);

      return {
        id,
        selected:
          modesHaveTransit &&
          selectedModes.includes(modeStr) &&
          (!selectedCompanies.length ||
            !modeCompanyUpper ||
            selectedCompanies.includes(modeCompanyUpper)),
        text: (
          <span>
            <ModeIcon mode="TRANSIT" />+{finalIcon}
          </span>
        ),
        title: modeLabel
      };
    })
  );
}

/**
 * Returns the exclusive mode options.
 * @param ModeIcon The icon component for rendering.
 * @param modes The available modes to choose from.
 * @param selectedModes An array of string that lists the modes selected for a trip query.
 */
function getExclusiveModeOptions(
  ModeIcon: ElementType,
  modes: ConfiguredModes,
  selectedModes: string[]
): ModeSelectorOption[] {
  const { exclusiveModes } = modes;

  return supportedExclusiveModes
    .filter(({ mode }) => exclusiveModes && exclusiveModes.includes(mode))
    .map(({ isActive, label, mode }) => ({
      id: mode,
      selected:
        !selectedModes.some(isTransit) &&
        selectedModes.some(isActive),
      showTitle: false,
      text: (
        <span>
          <ModeIcon mode={mode} /> {label}
        </span>
      ),
      title: label
    }));
}

/**
 * Generates the options (primary, secondary, tertiary) for the mode selector based on the modes read from config.yaml.
 * @param ModeIcon The icon component for rendering.
 * @param modes The available modes to choose from.
 * @param selectedModes An array of string that lists the modes selected for a trip query.
 * @param selectedCompanies The companies to show as selected (when the user selects an exclusive mode operated by multiple companies).
 * @param supportedCompanies The supported companies for certain access modes.
 */
export function getModeOptions(
  ModeIcon: ElementType,
  modes: ConfiguredModes,
  selectedModes: string[],
  selectedCompanies: string[],
  supportedCompanies: ConfiguredCompany[]
): ModeSelectorOptionSet {
  return {
    primary: getPrimaryModeOption(ModeIcon, selectedModes),
    secondary: getTransitCombinedModeOptions(
      ModeIcon,
      modes,
      selectedModes,
      selectedCompanies,
      supportedCompanies
    ),
    tertiary: getExclusiveModeOptions(ModeIcon, modes, selectedModes)
  };
}

/**
 * Returns the UI options for the specified companies, modes, and selection.
 * @param companies The supported companies per OTP configuration.
 * @param modes The desired modes for which to get the operating companies.
 * @param selectedCompanies The companies to render selected from the UI.
 * @returns An array of UI options (should not be undefined as companies is an array).
 */
export function getCompaniesOptions(
  companies: ConfiguredCompany[],
  modes: string[],
  selectedCompanies: string[]
): ModeSelectorOption[] {
  return getCompanies(companies, modes).map((comp: ConfiguredCompany) => {
    const CompanyIcon = getCompanyIcon(comp.id);

    return {
      id: comp.id,
      selected: selectedCompanies.includes(comp.id),
      text: (
        <span>
          {CompanyIcon && <CompanyIcon />} {comp.label}
        </span>
      ),
      title: comp.label
    };
  });
}

/**
 * Returns the UI options for the specified bike/micromobility modes and selection.
 * @param ModeIcon The component for rendering icons.
 * @param modes The supported bike or micromobility modes.
 * @param selectedModes The modes to render selected from the UI.
 * @returns An array of UI options, or undefined if modes is undefined.
 */
export function getBicycleOrMicromobilityModeOptions(
  ModeIcon: ElementType,
  modes: ModeOption[],
  selectedModes: string[]
): ModeSelectorOption[] {
  return (
    modes && modes
    .filter(isFullModeOption)
    .map(({ label, mode }) => ({
      id: mode,
      selected: selectedModes.includes(mode),
      text: (
        <span>
          <ModeIcon mode={mode} />
          {label}
        </span>
      ),
      title: label
    }))
  );
}
