import {
  ModeButtonDefinition,
  ModeSetting,
  ModeSettingValues,
  TransportMode
} from "@opentripplanner/types";

import coreUtils from "@opentripplanner/core-utils";

const { queryGen } = coreUtils;
const { TRANSIT_SUBMODES_AND_TRANSIT } = queryGen;

/**
 * Aggregates all the modes from the input mode button definitions
 * Should probably filter unique values, but it's not possible with a Set due to them being objects
 * @param modeButtonDefinitions Array of mode buttons
 * @returns All the (unique) modes from the buttons
 */
export function aggregateModes(
  modeButtonDefinitions: ModeButtonDefinition[]
): TransportMode[] {
  return modeButtonDefinitions.reduce<Array<TransportMode>>((array, combo) => {
    combo.modes.forEach(mode => array.push(mode));
    return array;
  }, new Array<TransportMode>());
}

/**
 * Filters mode buttons by list of keys, used to find enabled buttons.
 * TODO: Remove this function? Is it needed?
 * @param modeButtonDefinitions All mode definitions
 * @param keys List of keys of buttons to include
 * @returns Filtered list of buttons
 */
export function filterModeDefitionsByKey(
  modeButtonDefinitions: ModeButtonDefinition[],
  keys: string[]
): ModeButtonDefinition[] {
  return modeButtonDefinitions.filter(def => keys.includes(def.key));
}

/**
 * Sometimes we might get a string when we want a boolean or number,
 * since the URL state is stored as a string. This method helps convert
 * those values into the correct type.
 */
export function convertModeSettingValue(
  setting: ModeSetting,
  value: string | boolean | number
): string | boolean | number {
  switch (setting.type) {
    case "CHECKBOX":
      return value === "true" || value === true;
    case "SLIDER":
      return Number(value);
    default:
      return value;
  }
}

/**
 * Connects the mode setting value from a values object, where each key corresponds
 * to a mode setting in the modeSettings parameter.
 * @param modeSettings The mode setting with an empty `value` param
 * @param values An object containing setting values
 * @returns Mode Setting with populated value
 */
export const populateSettingWithValue = (values: ModeSettingValues) => (
  setting: ModeSetting
): ModeSetting => {
  const value = values[setting.key];
  const convertedValue = convertModeSettingValue(setting, value);
  return {
    ...setting,
    value: convertedValue as string & number & boolean
  };
};

/**
 * Extracts the defaults from each mode setting into an object
 * where the keys correspond with the keys from the mode setting.
 * @param modeSetting Mode settings with `default`s populated
 * @returns Object containing just the keys and values from defaults
 */
export function extractModeSettingDefaultsToObject(
  modeSettings: ModeSetting[]
): ModeSettingValues {
  return modeSettings?.reduce((prev, cur) => {
    prev[cur.key] = cur.default;
    if (cur.type === "SLIDER" && cur.inverseKey && cur.default) {
      prev[cur.inverseKey] = cur.high - cur.default + cur.low;
    }
    return prev;
  }, {});
}

/**
 * This function is used to apply the ModeSettings to the ModeButtons by checking
 * each setting against all the transport modes in the button. It also handles the special
 * case of a "TRANSIT" mode setting, which can apply to all of the different possible TRANSIT_MODES.
 * @param setting Mode setting to check
 * @param mode TransportMode to check against
 * @returns Whether this mode setting applies to this TransportMode
 */
export function checkIfModeSettingApplies(
  setting: ModeSetting,
  mode: TransportMode
): boolean {
  if (setting.applicableMode === "TRANSIT") {
    return TRANSIT_SUBMODES_AND_TRANSIT.includes(mode.mode);
  }
  return setting.applicableMode === mode.mode;
}

/**
 * Higher order function that can be used in `map` to add mode settings to mode button definitions.
 * @param settings Mode settings to be added to button
 * @returns Function that accepts a mode button definition, returning mode button def with populated settings
 */
export const addSettingsToButton = (settings: ModeSetting[]) => (
  button: ModeButtonDefinition
): ModeButtonDefinition => {
  const settingsForThisCombination = Array.from(
    new Set(
      button.modes?.reduce<ModeSetting[]>((prev, mode) => {
        return [
          ...prev,
          ...settings.filter(def => checkIfModeSettingApplies(def, mode))
        ];
      }, [])
    )
  );

  return {
    ...button,
    modeSettings: settingsForThisCombination
  };
};
/**
 * Provides a function that sets mode buttons' enabled state
 * Intended to be composed in a map
 * @param initialState Initial State object
 * @param enabledKeys Array of enabled keys, if not provided default to initial state
 * @returns Function that accepts mode button and returns a mode button with enabled key set
 */
export const setModeButtonEnabled = (enabledKeys: string[]) => (
  modeButton: ModeButtonDefinition
): ModeButtonDefinition => {
  return {
    ...modeButton,
    enabled: enabledKeys.includes(modeButton.key)
  };
};
