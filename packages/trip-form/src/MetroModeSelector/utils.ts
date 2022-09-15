import { useState } from "react";
import { Combination, ModeSettingValues } from "./types";

export type InitialStateType = {
  enabledCombinations: string[];
  modeSettings: ModeSettingValues;
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

  const [modeSettings, setModeSettings] = useState<ModeSettingValues>(
    initialState.modeSettings
  );

  const setIndividualModeSetting = (settingKey, value) => {
    setModeSettings({
      ...modeSettings,
      [settingKey]: value
    });
  };

  return {
    setIndividualModeSetting,
    combinations,
    enabledCombinationKeys,
    modeSettings,
    toggleCombination
  };
}
