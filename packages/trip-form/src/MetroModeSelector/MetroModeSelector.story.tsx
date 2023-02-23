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
  disableHover,
  modeButtonDefinitions,
  fillModeIcons,
  onToggleModeButton,
  onSetModeSettingValue
}: {
  disableHover?: boolean;
  modeButtonDefinitions: ModeButtonDefinition[];
  onToggleModeButton: (key: string) => void;
  fillModeIcons?: boolean;
  onSetModeSettingValue: (event: QueryParamChangeEvent) => void;
}): ReactElement => {
  const initialState = {
    enabledModeButtons: ["TRANSIT"],
    modeSettingValues: {}
  };
  const {
    buttonsWithSettings,
    toggleModeButton,
    setModeSettingValue
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
    <div style={{ width: "340px", position: "relative" }}>
      <Core.MetroModeSelector
        onToggleModeButton={toggleModeButtonAction}
        modeButtons={buttonsWithSettings}
        onSettingsUpdate={setModeSettingValueAction}
        fillModeIcons={fillModeIcons}
        disableHover={disableHover}
      />
    </div>
  );
};

const Template = (args: {
  disableHover?: boolean;
  fillModeIcons?: boolean;
  onToggleModeButton: (key: string) => void;
  onSetModeSettingValue: (event: QueryParamChangeEvent) => void;
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
    disableHover: { control: "boolean" },
    fillModeIcons: { control: "boolean" },
    onToggleModeButton: { action: "toggle button" },
    onSetModeSettingValue: { action: "set mode setting value" }
  }
};

export const MetroModeSelector = Template.bind({});
