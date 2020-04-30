import React from "react";
import {
  hasRental,
  hasHail,
  isBicycle,
  isBicycleRent,
  isMicromobility,
  isTransit,
  isWalk
} from "@opentripplanner/core-utils/lib/itinerary";
import { getCompanyIcon } from "@opentripplanner/icons/lib/companies";

export function isBike(mode) {
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
export function getModeString(modeObj) {
  return modeObj.mode || modeObj;
}

/**
 * Of the specified companies, returns those that operate the specified modes.
 * @param {*} companies The supported companies per OTP configuration.
 * @param {*} modes The desired modes for which to get the operating companies.
 * @returns An array of companies that operate the specified modes (should not be undefined as companies is an array).
 */
function getCompanies(companies, modes) {
  return companies
    .filter(
      comp => comp.modes.split(",").filter(m => modes.includes(m)).length > 0
    )
    .filter(comp => hasRental(comp.modes) || hasHail(comp.modes));
}

/**
 * Returns an array containing the company ids, in upper case for MOD UI URLs, for the specified mode id.
 * The mode id scheme is set and used by function getTransitCombinedModeOptions().
 * @param {*} id The mode id to process.
 * @param {*} supportedCompanies The list of supported companies (see structure in __mocks__/companies.js).
 */
export function getCompaniesForModeId(id, supportedCompanies) {
  const newModes = id.split("+");
  const nonTransitModes = newModes.length > 1 ? [newModes[1]] : ["WALK"];
  // TODO: for non-transit modes, shoudl we also accommodate WALK+DRIVE, WALK+e-scooter??
  // They already seem to work without WALK right now.

  // Accommodate companies defined under accessModes.
  // Convert company ID to upper case for passing to MOD UI URL.
  const defaultAccessModeCompany =
    newModes.length > 2 ? [newModes[2].toUpperCase()] : null;

  // If there are multiple (scooter | bikeshare | etc.) companies,
  // then if one is specified in the configured modes, then use that company.
  // Othewise, if this is for an exclusive mode (bike, scooter), then use all companies.
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
 * @param {*} ModeIcon The icon component for rendering.
 * @param {*} modes The available modes to choose from.
 * @param {*} selectedModes The modes that should appear selected.
 */
export function getTransitSubmodeOptions(ModeIcon, modes, selectedModes) {
  const { transitModes } = modes;

  // FIXME: If only one transit mode is available, select it.
  return transitModes.map(modeObj => {
    const modeStr = getModeString(modeObj);
    return {
      id: modeStr,
      selected: selectedModes.includes(modeStr),
      text: (
        <span>
          <ModeIcon mode={modeStr} />
          {modeObj.label}
        </span>
      ),
      title: modeObj.label
    };
  });
}

/**
 * Returns big primary "Take Transit" choice.
 * @param {*} ModeIcon The icon component for rendering.
 * @param {*} selectedModes An array of string that lists the modes selected for a trip query.
 */
function getPrimaryModeOption(ModeIcon, selectedModes) {
  return {
    id: "TRANSIT",
    selected: selectedModes.some(isTransit) && selectedModes.includes("WALK"),
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
 * @param {*} icons The icon set to use.
 * @param {*} modes The available modes to choose from.
 * @param {*} selectedModes An array of string that lists the modes selected for a trip query.
 * @param {*} selectedCompanies The companies to show as selected.
 * @param {*} supportedCompanies The supported companies for certain modes.
 */
function getTransitCombinedModeOptions(
  ModeIcon,
  modes,
  selectedModes,
  selectedCompanies,
  supportedCompanies
) {
  const { accessModes } = modes;
  const modesHaveTransit = selectedModes.some(isTransit);

  return (
    accessModes &&
    accessModes.map(modeObj => {
      const modeStr = getModeString(modeObj);
      const modeCompany = modeObj.company
        ? modeObj.company.toUpperCase()
        : null;

      const company = modeObj.company ? `+${modeObj.company}` : "";
      const id = `TRANSIT+${modeStr}${company}`;

      const { companies } = getCompaniesForModeId(id, supportedCompanies);
      const modeMonopoly = companies[0];
      const CompanyIcon = getCompanyIcon(modeCompany || modeMonopoly || "");

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
      const FinalIcon =
        ModeIcon({ mode: modeStr }) ||
        ModeIcon({ mode: `${modeStr}_${modeCompany}` }) ||
        (CompanyIcon && <CompanyIcon />);

      return {
        id,
        selected:
          modesHaveTransit &&
          selectedModes.includes(modeStr) &&
          (!selectedCompanies.length ||
            !modeCompany ||
            selectedCompanies.includes(modeCompany)),
        text: (
          <span>
            <ModeIcon mode="TRANSIT" />+{FinalIcon}
          </span>
        ),
        title: modeObj.label
      };
    })
  );
}

/**
 * Returns the exclusive mode options.
 * @param {*} ModeIcon The icon component for rendering.
 * @param {*} modes The available modes to choose from.
 * @param {*} selectedModes An array of string that lists the modes selected for a trip query.
 */
function getExclusiveModeOptions(ModeIcon, modes, selectedModes) {
  const { exclusiveModes } = modes;

  return supportedExclusiveModes
    .filter(({ mode }) => exclusiveModes && exclusiveModes.includes(mode))
    .map(({ isActive, label, mode }) => ({
      id: mode,
      selected: !selectedModes.some(isTransit) && selectedModes.some(isActive),
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
 * @param {*} modes The modes defined in config.yaml.
 * @param {*} icons The icon set to use.
 * @param {*} modes The available modes to choose from.
 * @param {*} selectedModes An array of string that lists the modes selected for a trip query.
 * @param {*} selectedCompanies The companies to show as selected (when the user selects an exclusive mode operated by multiple companies).
 * @param {*} supportedCompanies The supported companies for certain access modes.
 */
export function getModeOptions(
  ModeIcon,
  modes,
  selectedModes,
  selectedCompanies,
  supportedCompanies
) {
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
 * @param {*} companies The supported companies per OTP configuration.
 * @param {*} modes The desired modes for which to get the operating companies.
 * @param {*} selectedCompanies The companies to render selected from the UI.
 * @returns An array of UI options (should not be undefined as companies is an array).
 */
export function getCompaniesOptions(companies, modes, selectedCompanies) {
  return getCompanies(companies, modes).map(comp => {
    const CompanyIcon = getCompanyIcon(comp.id);

    return {
      id: comp.id,
      selected: selectedCompanies.includes(comp.id),
      text: (
        <span>
          <CompanyIcon /> {comp.label}
        </span>
      ),
      title: comp.label
    };
  });
}

/**
 * Returns the UI options for the specified bike/micromobility modes and selection.
 * @param {*} ModeIcon The component for rendering icons.
 * @param {*} modes The supported bike or micromobility modes.
 * @param {*} selectedModes The modes to render selected from the UI.
 * @returns An array of UI options, or undefined if modes is undefined.
 */
export function getBicycleOrMicromobilityModeOptions(
  ModeIcon,
  modes,
  selectedModes
) {
  return (
    modes &&
    modes.map(({ label, mode }) => ({
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
