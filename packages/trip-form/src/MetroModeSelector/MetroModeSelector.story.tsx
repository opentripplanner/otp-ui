import { ModeButtonDefinition } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import { Bicycle, Bus, Car, PersonWalking } from "@styled-icons/fa-solid";
import * as Core from "..";
import { QueryParamChangeEvent } from "../types";

import modeSettingDefinitions from "../../modeSettings.yml";

const defaultModeButtonDefinitions = [
  {
    label: "Transit",
    Icon: Bus,
    iconName: "bus",
    key: "TRANSIT",
    modes: [
      {
        mode: "TRANSIT"
      }
    ]
  },
  {
    label: "Walking",
    Icon: PersonWalking,
    iconName: "person-walking",
    key: "WALK",
    modes: [{ mode: "WALK" }]
  },
  {
    label: "Bike",
    Icon: Bicycle,
    iconName: "bicycle",
    key: "BICYCLE",
    modes: [{ mode: "BICYCLE" }]
  },
  {
    label: "Drive",
    Icon: Car,
    iconName: "car",
    key: "CAR",
    modes: [{ mode: "CAR" }]
  }
];

const modeSettingDefinitionsWithDropdown = [
  ...modeSettingDefinitions,
  {
    applicableMode: "TRANSIT",
    type: "DROPDOWN",
    key: "busColor",
    default: "blue",
    label: "Bus Color",
    options: [{ value: "blue" }]
  }
];

const MetroModeSelectorComponent = ({
  fillModeIcons,
  modeButtonDefinitions,
  onSetModeSettingValue,
  onToggleModeButton
}: {
  fillModeIcons?: boolean;
  modeButtonDefinitions: ModeButtonDefinition[];
  onSetModeSettingValue: (event: QueryParamChangeEvent) => void;
  onToggleModeButton: (key: string) => void;
}): ReactElement => {
  const initialState = {
    enabledModeButtons: ["TRANSIT"],
    modeSettingValues: {}
  };
  const {
    buttonsWithSettings,
    setModeSettingValue,
    toggleModeButton
  } = Core.useModeState(
    modeButtonDefinitions,
    initialState,
    modeSettingDefinitionsWithDropdown,
    {
      queryParamState: false
    }
  );

  const toggleModeButtonAction = (key: string) => {
    toggleModeButton(key);
    onToggleModeButton(key);
  };

  const setModeSettingValueAction = (event: QueryParamChangeEvent) => {
    setModeSettingValue(event);
    onSetModeSettingValue(event);
  };

  return (
    <div style={{ position: "relative" }}>
      <Core.MetroModeSelector
        fillModeIcons={fillModeIcons}
        label="Select a transit mode"
        modeButtons={buttonsWithSettings}
        onSettingsUpdate={setModeSettingValueAction}
        onToggleModeButton={toggleModeButtonAction}
      />
    </div>
  );
};

const Template = (args: {
  fillModeIcons?: boolean;
  onSetModeSettingValue: (event: QueryParamChangeEvent) => void;
  onToggleModeButton: (key: string) => void;
}): ReactElement => (
  <QueryParamProvider adapter={WindowHistoryAdapter}>
    <MetroModeSelectorComponent
      modeButtonDefinitions={defaultModeButtonDefinitions}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...args}
    />
  </QueryParamProvider>
);

export default {
  component: MetroModeSelectorComponent,
  title: "Trip Form Components/Metro Mode Selector",
  argTypes: {
    fillModeIcons: { control: "boolean" },
    onSetModeSettingValue: { action: "set mode setting value" },
    onToggleModeButton: { action: "toggle button" }
  }
};

export const MetroModeSelector = Template.bind({});
