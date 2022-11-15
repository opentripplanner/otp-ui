import { useState } from "react";
import {
  useQueryParam,
  DelimitedArrayParam,
  ObjectParam
} from "use-query-params";
import { QueryParamConfig, decodeQueryParams } from "serialize-query-params";
import {
  ModeButtonDefinition,
  ModeSetting,
  ModeSettingValues,
  TransportMode
} from "@opentripplanner/types";
import { QueryParamChangeEvent } from "../types";

export type InitialStateType = {
  enabledModeButtons: string[];
  modeSettingValues: ModeSettingValues;
};

export type ModeStateConfig = {
  queryParamState?: boolean;
};
function aggregateModes(modeButtonDefinitions: ModeButtonDefinition[]) {
  return Array.from(
    modeButtonDefinitions.reduce<Set<TransportMode>>((set, combo) => {
      combo.modes.forEach(mode => set.add(mode));
      return set;
    }, new Set<TransportMode>())
  );
}

function filterModeDefitionsByKey(
  modeButtonDefinitions: ModeButtonDefinition[],
  keys: string[]
) {
  return modeButtonDefinitions.filter(def => keys.includes(def.key));
}

export const getSettingsForCombination = (
  settings: ModeSetting[],
  values: ModeSettingValues
) => (combination: ModeButtonDefinition): ModeButtonDefinition => {
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
  searchString: string,
  modeButtons: ModeButtonDefinition[],
  initialState: InitialStateType
): TransportMode[] {
  const queryObject = new URLSearchParams(searchString);
  const decodedQuery = decodeQueryParams(
    { modeButtons: DelimitedArrayParam },
    { modeButtons: queryObject.get("modeButtons") }
  );
  const enabledKeys =
    decodedQuery.modeButtons || initialState.enabledModeButtons;
  const activeButtons = filterModeDefitionsByKey(modeButtons, enabledKeys);
  return aggregateModes(activeButtons);
}

export function useModeState(
  buttonsFromConfig: ModeButtonDefinition[],
  initialState: InitialStateType,
  modeSettingDefinitions: ModeSetting[],
  { queryParamState }: ModeStateConfig
): {
  setModeSettingValue: (setting: QueryParamChangeEvent) => void;
  buttonsWithSettings: ModeButtonDefinition[];
  enabledModeButtonKeys: string[];
  enabledModes: TransportMode[];
  toggleModeButton: (key: string) => void;
} {
  const [enabledModeButtonKeys, setEnabledModeButtonKeys] = useStateStorage<
    string[]
  >(
    "modeButtons",
    DelimitedArrayParam,
    queryParamState,
    initialState.enabledModeButtons
  );

  const modeButtons = buttonsFromConfig.map(combo => ({
    ...combo,
    enabled: enabledModeButtonKeys.includes(combo.key)
  }));

  const toggleModeButton = (modeButtonKey: string) => {
    if (enabledModeButtonKeys.includes(modeButtonKey)) {
      setEnabledModeButtonKeys(
        enabledModeButtonKeys.filter(c => c !== modeButtonKey)
      );
    } else {
      setEnabledModeButtonKeys([...enabledModeButtonKeys, modeButtonKey]);
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

  const buttonsWithSettings = modeButtons.map(
    getSettingsForCombination(modeSettingDefinitions, modeSettingsValues)
  );

  const enabledModeButtons = filterModeDefitionsByKey(
    buttonsWithSettings,
    enabledModeButtonKeys
  );
  const enabledModes = aggregateModes(enabledModeButtons);

  return {
    setModeSettingValue,
    buttonsWithSettings,
    enabledModeButtonKeys,
    enabledModes,
    toggleModeButton
  };
}
