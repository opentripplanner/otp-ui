import { useState } from "react";
import {
  useQueryParam,
  DelimitedArrayParam,
  ObjectParam
} from "use-query-params";
import { QueryParamConfig } from "serialize-query-params";
import { Combination, ModeSetting, ModeSettingValues } from "./types";
import { QueryParamChangeEvent } from "../types";

export type InitialStateType = {
  enabledCombinations: string[];
  modeSettingValues: ModeSettingValues;
};

export type ModeStateConfig = {
  queryParamState?: boolean;
};

export const getSettingsForCombination = (
  settings: ModeSetting[],
  values: ModeSettingValues
) => (combination: Combination): Combination => {
  const definitionsWithValues = settings.map(def => ({
    ...def,
    value: values[def.key] as boolean & number & string
  }));

  return {
    ...combination,
    modes: combination.modes.map(mode => ({
      ...mode,
      settings: definitionsWithValues.filter(
        def => def.applicableMode === mode.mode
      )
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
  modeSettingDefinitions: ModeSetting[],
  { queryParamState }: ModeStateConfig
): {
  setModeSettingValue: (setting: QueryParamChangeEvent) => void;
  combinations: Combination[];
  enabledCombinations: Combination[];
  enabledCombinationKeys: string[];
  toggleCombination: (key: string) => void;
} {
  const [enabledCombinationKeys, setEnabledCombinationKeys] = useStateStorage<
    string[]
  >(
    "combinations",
    DelimitedArrayParam,
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
    ...modeSettingDefinitions.reduce((prev, cur) => {
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

  const combosWithSettings = combinations.map(
    getSettingsForCombination(modeSettingDefinitions, modeSettingsValues)
  );

  const enabledCombinations = combosWithSettings.filter(c =>
    enabledCombinationKeys.includes(c.key)
  );

  return {
    setModeSettingValue,
    combinations: combosWithSettings,
    enabledCombinations,
    enabledCombinationKeys,
    toggleCombination
  };
}
