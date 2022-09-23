import React, { ReactElement } from "react";
import styled from "styled-components";
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
    case ModeSettingTypes.SLIDER:
      return (
        <SliderSelector
          max={setting.high}
          min={setting.low}
          labelHigh={setting.labelHigh}
          labelLow={setting.labelLow}
          label={setting.label}
          step={setting.step}
          name={setting.key}
          onChange={onChange}
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
