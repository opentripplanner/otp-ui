import { useState } from "react";
import { Combination, ModeSetting, ModeSettingValues } from "./types";
import modeSettingsDefinitions from "./modeSettings.yml";
import { QueryParamChangeEvent } from "../types";

export type InitialStateType = {
  enabledCombinations: string[];
  modeSettingValues: ModeSettingValues;
};

export const getSettingsForCombination = (settings: ModeSetting[]) => (
  combination: Combination
): Combination => {
  return {
    ...combination,
    modes: combination.modes.map(mode => ({
      ...mode,
      settings: settings.filter(def => def.applicableMode === mode.mode)
    }))
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useModeState(
  combinationsFromConfig: Combination[],
  initialState: InitialStateType
) {
  // Handle combination state
  const [enabledCombinationKeys, setEnabledCombinationKeys] = useState<
    string[]
  >(initialState.enabledCombinations);

  const combinations = combinationsFromConfig.map(combo => ({
    ...combo,
    enabled: enabledCombinationKeys.includes(combo.key)
  }));

  const toggleCombination = combinationKey => {
    if (enabledCombinationKeys.includes(combinationKey)) {
      setEnabledCombinationKeys(
        enabledCombinationKeys.filter(c => c !== combinationKey)
      );
    } else {
      setEnabledCombinationKeys([...enabledCombinationKeys, combinationKey]);
    }
  };

  const [modeSettingsValues, setModeSettingsValues] = useState<
    ModeSettingValues
  >(initialState.modeSettingValues);

  const setModeSettingValue = (setting: QueryParamChangeEvent) => {
    setModeSettingsValues({
      ...modeSettingsValues,
      ...setting
    });
  };

  const definitionsWithValues: ModeSetting[] = modeSettingsDefinitions.map(
    def => ({
      ...def,
      value: modeSettingsValues[def.key]
    })
  );

  const combosWithSettings = combinations.map(
    getSettingsForCombination(definitionsWithValues)
  );

  return {
    setModeSettingValue,
    combinations: combosWithSettings,
    enabledCombinationKeys,
    toggleCombination
  };
}
