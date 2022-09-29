import { useState } from "react";
import { useQueryParam, ArrayParam, ObjectParam } from "use-query-params";
import { QueryParamConfig } from "serialize-query-params";
import { Combination, ModeSetting, ModeSettingValues } from "./types";
import modeSettingsDefinitions from "./modeSettings.yml";
import { QueryParamChangeEvent } from "../types";

export type InitialStateType = {
  enabledCombinations: string[];
  modeSettingValues: ModeSettingValues;
};

export type ModeStateConfig = {
  queryParamState?: boolean;
};

export const getSettingsForCombination = (settings: ModeSetting[]) => (
  combination: Combination
): Combination => {
  return {
    ...combination,
    modes: combination.modes.map(mode => ({
      ...mode,
      settings: [
        ...settings.filter(def => def.applicableMode === mode.mode),
        ...(mode.settings || [])
      ]
    }))
  };
};

export function useStateStorage<Type>(
  name: string,
  stateType: QueryParamConfig<Type>,
  storeInQueryParam: boolean,
  defaultState?: Type
): [Type, (newValue: Type) => void] {
  const [qpState, setQpState] = useQueryParam<Type>(name, stateType);
  const [reactState, setReactState] = useState<Type>(defaultState);

  if (!storeInQueryParam) {
    return [reactState, setReactState];
  }

  if (qpState === undefined) {
    return [defaultState, setQpState];
  }
  return [qpState, setQpState];
}

export function useModeState(
  combinationsFromConfig: Combination[],
  initialState: InitialStateType,
  { queryParamState }: ModeStateConfig
): {
  setModeSettingValue: (setting: QueryParamChangeEvent) => void;
  combinations: Combination[];
  enabledCombinationKeys: string[];
  toggleCombination: (key: string) => void;
} {
  const [enabledCombinationKeys, setEnabledCombinationKeys] = useStateStorage<
    string[]
  >(
    "combinations",
    ArrayParam,
    queryParamState,
    initialState.enabledCombinations
  );

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

  const defaultModeSettingsValues = {
    ...modeSettingsDefinitions.reduce((prev, cur) => {
      prev[cur.key] = cur.default;
      return prev;
    }, {}),
    ...initialState.modeSettingValues
  };

  // Handle ModeSettings state
  const [modeSettingsValues, setModeSettingsValues] = useStateStorage<
    ModeSettingValues
  >("modeSettings", ObjectParam, queryParamState, defaultModeSettingsValues);

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
