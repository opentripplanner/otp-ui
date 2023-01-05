import { ModeButtonDefinition, ModeSetting } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import styled from "styled-components";
import { CircleXmark } from "@styled-icons/fa-solid";
import { useIntl } from "react-intl";
import { flatten } from "flat";

import CheckboxSelector from "../CheckboxSelector";
import DropdownSelector from "../DropdownSelector";
import SliderSelector from "../SliderSelector";
import generateModeButtonLabel from "./i18n";

import defaultEnglishMessages from "../../i18n/en-US.yml";
// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

const Header = styled.div`
  font-size: 1.5em;
  margin-bottom: 0.5rem;
  text-align: left;
  display: flex;
  justify-content: space-between;
`;

const SettingsPanel = styled.div`
  pointer-events: auto;
  padding: 15px;
`;

const DisableButton = styled.button`
  padding: 4px;
  cursor: pointer;
`;

const ModeSettingRenderer = ({
  setting,
  onChange
}: {
  setting: ModeSetting;
  onChange: (QueryParamChangeEvent) => void;
}) => {
  const intl = useIntl();
  const label = intl.formatMessage({
    id: `otpUi.modeSelector.settings.${setting.key}-label`,
    description: `Metro Mode Selector Setting Label (${setting.key})`,
    defaultMessage:
      defaultMessages[`otpUi.modeSelector.settings.${setting.key}-label`]
  });

  switch (setting.type) {
    case "CHECKBOX":
      return (
        <CheckboxSelector
          label={label}
          name={setting.key}
          onChange={onChange}
          value={setting.value}
          style={{ marginLeft: "4px" }}
        />
      );
    case "DROPDOWN":
      return (
        <DropdownSelector
          label={label}
          name={setting.key}
          onChange={onChange}
          value={setting.value}
          options={setting.options.map(o => ({
            ...o,
            text: intl.formatMessage({
              id: `otpUi.modeSelector.settings.${setting.key}-options.${o.value}`,
              description: `Metro Mode Selector Setting (${setting.key}) Option Label (${o.value})`
            })
          }))}
        />
      );
    case "SLIDER":
      return (
        <SliderSelector
          label={label}
          labelHigh={intl.formatMessage({
            id: `otpUi.modeSelector.settings.${setting.key}-labelHigh`,
            description: `Metro Mode Selector Setting Label High (${setting.key})`
          })}
          labelLow={intl.formatMessage({
            id: `otpUi.modeSelector.settings.${setting.key}-labelLow`,
            description: `Metro Mode Selector Setting Label Low (${setting.key})`
          })}
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
  modeButton: ModeButtonDefinition;
  onSettingUpdate: (QueryParamChangeEvent) => void;
  showControls: boolean;
  onDismiss: () => void;
  onDisableMode: () => void;
}
export default function SubSettingsPane({
  modeButton,
  onSettingUpdate,
  showControls,
  onDisableMode
}: Props): ReactElement {
  const intl = useIntl();
  const label = generateModeButtonLabel(modeButton.key, intl);
  return (
    <SettingsPanel>
      <Header>
        {label}
        {showControls && (
          <DisableButton type="button" onClick={onDisableMode}>
            Disable {label} <CircleXmark size={16} />
          </DisableButton>
        )}
      </Header>
      {modeButton.modeSettings.map(setting => (
        <div key={setting.key}>
          <ModeSettingRenderer
            setting={setting}
            key={setting.key}
            onChange={onSettingUpdate}
          />
        </div>
      ))}
    </SettingsPanel>
  );
}
