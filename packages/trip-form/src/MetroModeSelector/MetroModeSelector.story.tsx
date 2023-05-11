import { ModeButtonDefinition } from "@opentripplanner/types";
import {
  Bus,
  Car,
  PersonWalking,
  Train,
  TrainSubway,
  TrainTram
} from "@styled-icons/fa-solid";
import { ClassicBike } from "@opentripplanner/icons/lib/classic";
import React, { ReactElement, useState } from "react";
import * as Core from "..";
import { QueryParamChangeEvent } from "../types";
import {
  addSettingsToButton,
  extractModeSettingDefaultsToObject,
  populateSettingWithValue,
  setModeButtonEnabled
} from "./utils";

import modeSettingDefinitions from "../../modeSettings.yml";

const getIcon = (iconName: string): JSX.Element | null => {
  switch (iconName) {
    case "bus":
      return <Bus />;
    case "tram":
      return <TrainTram />;
    case "subway":
      return <TrainSubway />;
    case "train":
      return <Train />;
    default:
      return null;
  }
};

const defaultModeButtonDefinitions = [
  {
    Icon: Bus,
    iconName: "bus",
    key: "transit",
    label: "Bus",
    modes: [{ mode: "TRANSIT" }]
  },
  {
    Icon: PersonWalking,
    iconName: "person-walking",
    key: "walk",
    label: "Walk",
    modes: [{ mode: "WALK" }]
  },
  {
    // Using TriMet icon here to illustrate the use of fillModeIcons prop.
    Icon: ClassicBike,
    iconName: "bicycle",
    key: "bicycle",
    label: "Bike",
    modes: [{ mode: "BICYCLE" }]
  },
  {
    Icon: Car,
    iconName: "car",
    key: "car",
    label: "Car",
    modes: [{ mode: "CAR" }]
  }
];

const modeSettingDefinitionsWithDropdown = [
  ...modeSettingDefinitions,
  {
    applicableMode: "TRANSIT",
    default: "blue",
    key: "busColor",
    label: "Bus Color",
    options: [{ value: "blue", text: "Blue" }],
    type: "DROPDOWN"
  },
  {
    applicableMode: "TRANSIT",
    default: true,
    key: "tram",
    label: "Tram",
    addTransportMode: {
      mode: "TRAM"
    },
    type: "SUBMODE"
  },
  {
    applicableMode: "TRANSIT",
    default: true,
    key: "bus",
    label: "Bus",
    iconName: "bus",
    addTransportMode: {
      mode: "BUS"
    },
    type: "SUBMODE"
  },
  {
    applicableMode: "TRANSIT",
    default: true,
    key: "ferry",
    label: "Subway",
    iconName: "subway",
    addTransportMode: {
      mode: "SUBWAY"
    },
    type: "SUBMODE"
  },
  {
    applicableMode: "TRANSIT",
    default: true,
    key: "ferry",
    label: "Ferry",
    addTransportMode: {
      mode: "FERRY"
    },
    type: "SUBMODE"
  }
];

const initialState = {
  enabledModeButtons: ["transit"],
  modeSettingValues: {}
};

function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}

const MetroModeSelectorComponent = ({
  fillModeIcons,
  modeButtonDefinitions,
  onSetModeSettingValue,
  onToggleModeButton
}: {
  fillModeIcons?: boolean;
  modeButtonDefinitions: ModeButtonDefinition[];
  onSetModeSettingValue: (event: QueryParamChangeEvent) => void;
  onToggleModeButton: (key: string, newState: boolean) => void;
}): ReactElement => {
  const [modeSettingValues, setModeSettingValues] = useState({});
  const modeSettingValuesWithDefaults = {
    ...extractModeSettingDefaultsToObject(modeSettingDefinitionsWithDropdown),
    ...initialState.modeSettingValues,
    ...modeSettingValues
  };

  const [activeModeButtonKeys, setModeButtonKeys] = useState(
    initialState.enabledModeButtons
  );

  const addIconToModeSetting = msd => ({
    ...msd,
    icon: getIcon(msd.iconName)
  });

  const processedModeSettings = modeSettingDefinitionsWithDropdown.map(
    pipe(
      addIconToModeSetting,
      populateSettingWithValue(modeSettingValuesWithDefaults)
    )
  );

  const processedModeButtons = modeButtonDefinitions.map(
    pipe(
      addSettingsToButton(processedModeSettings),
      setModeButtonEnabled(activeModeButtonKeys)
    )
  );

  const toggleModeButtonAction = (key: string, newState: boolean) => {
    if (newState) {
      setModeButtonKeys([...activeModeButtonKeys, key]);
    } else {
      setModeButtonKeys(activeModeButtonKeys.filter(button => button !== key));
    }
    // Storybook Action:
    onToggleModeButton(key, newState);
  };

  const setModeSettingValueAction = (event: QueryParamChangeEvent) => {
    setModeSettingValues({ ...modeSettingValues, ...event });
    // Storybook Action:
    onSetModeSettingValue(event);
  };

  return (
    <Core.MetroModeSelector
      fillModeIcons={fillModeIcons}
      label="Select a transit mode"
      modeButtons={processedModeButtons}
      onSettingsUpdate={setModeSettingValueAction}
      onToggleModeButton={toggleModeButtonAction}
    />
  );
};

const Template = (args: {
  fillModeIcons?: boolean;
  onSetModeSettingValue: (event: QueryParamChangeEvent) => void;
  onToggleModeButton: (key: string, newState: boolean) => void;
}): ReactElement => (
  <MetroModeSelectorComponent
    modeButtonDefinitions={defaultModeButtonDefinitions}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...args}
  />
);

export default {
  argTypes: {
    fillModeIcons: { control: "boolean" },
    onSetModeSettingValue: { action: "set mode setting value" },
    onToggleModeButton: { action: "toggle button" }
  },
  component: MetroModeSelectorComponent,
  title: "Trip Form Components/Metro Mode Selector"
};

export const MetroModeSelector = Template.bind({});

const a11yOverrideParameters = {
  a11y: { config: { rules: [{ id: "label", reviewOnFail: true }] } }
};
MetroModeSelector.parameters = a11yOverrideParameters;
