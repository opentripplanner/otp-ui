import { useState } from "react";
import {
  useQueryParam,
  DelimitedArrayParam,
  ObjectParam
} from "use-query-params";
import { QueryParamConfig, decodeQueryParams } from "serialize-query-params";
import {
  Combination,
  ModeSetting,
  ModeSettingValues,
  TransportationMode
} from "@opentripplanner/types";
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

  const settingsForThisCombination = combination.modes.reduce<ModeSetting[]>(
    (prev, mode) => {
      return [
        ...prev,
        ...definitionsWithValues.filter(def => def.applicableMode === mode.mode)
      ];
    },
    []
  );

  return {
    ...combination,
    modeSettings: settingsForThisCombination
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

export function getActivatedModesFromQueryParams(
  searchString: string
): string[] {
  const queryObject = new URLSearchParams(searchString);
  decodeQueryParams(
    { combinations: DelimitedArrayParam },
    { combinations: queryObject.get("combinations") }
  );
  return [];
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
  enabledModes: TransportationMode[];
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

  const enabledModes = Array.from(
    enabledCombinations.reduce((set, combo) => {
      combo.modes.forEach(mode => set.add(mode));
      return set;
    }, new Set<TransportationMode>())
  );

  return {
    setModeSettingValue,
    combinations: combosWithSettings,
    enabledCombinations,
    enabledCombinationKeys,
    enabledModes,
    toggleCombination
  };
}
