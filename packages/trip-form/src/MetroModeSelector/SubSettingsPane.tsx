import React, { ReactElement } from "react";
import styled from "styled-components";
import CheckboxSelector from "../CheckboxSelector";
import DropdownSelector from "../DropdownSelector";
import SliderSelector from "../SliderSelector";
import { Combination, ModeSetting, ModeSettingTypes } from "./types";

const Header = styled.div`
  font-size: 2em;
  text-align: left;
`;

const SettingsPanel = styled.div`
  pointer-events: auto;
`;

const ModeSettingRenderer = ({
  setting,
  onChange
}: {
  setting: ModeSetting;
  onChange: (QueryParamChangeEvent) => void;
}) => {
  switch (setting.type) {
    case ModeSettingTypes.CHECKBOX:
      return (
        <CheckboxSelector
          label={setting.label}
          name={setting.key}
          onChange={onChange}
          value={setting.value}
        />
      );
    case ModeSettingTypes.DROPDOWN:
      return (
        <DropdownSelector
          label={setting.label}
          name={setting.key}
          onChange={onChange}
          value={setting.value}
          options={setting.options}
        />
      );
    case ModeSettingTypes.SLIDER:
      return (
        <SliderSelector
          label={setting.label}
          labelHigh={setting.labelHigh}
          labelLow={setting.labelLow}
          max={setting.high}
          min={setting.low}
          name={setting.key}
          onChange={onChange}
          step={setting.step}
          value={setting.value}
        />
      );
    default:
      return null;
  }
};

interface Props {
  combination: Combination;
  onSettingUpdate: (QueryParamChangeEvent) => void;
}
export default function SubSettingsPane({
  combination,
  onSettingUpdate
}: Props): ReactElement {
  return (
    <SettingsPanel>
      <Header>{combination.label}</Header>
      {combination.modes.map(mode => (
        <div key={mode.mode}>
          {mode.settings.map(setting => (
            <ModeSettingRenderer
              setting={setting}
              key={setting.key}
              onChange={onSettingUpdate}
            />
          ))}
        </div>
      ))}
    </SettingsPanel>
  );
}
