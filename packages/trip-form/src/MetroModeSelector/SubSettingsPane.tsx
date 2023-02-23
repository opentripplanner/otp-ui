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
import { QueryParamChangeEvent } from "../types";
// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

const Header = styled.div`
  display: flex;
  font-size: 1.5em;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  text-align: left;
`;

const SettingsPanel = styled.div`
  padding: 15px;
  pointer-events: auto;
`;

const DisableButton = styled.button`
  cursor: pointer;
  padding: 4px;
`;

const SubSettingsCheckbox = styled(CheckboxSelector)`
  margin-left: 4px;
`;

const ModeSettingRenderer = ({
  onChange,
  setting
}: {
  onChange: (QueryParamChangeEvent) => void;
  setting: ModeSetting;
}) => {
  const intl = useIntl();
  const label = intl.formatMessage({
    id: `otpUi.ModeSelector.settings.${setting.key}-label`,
    description: `Metro Mode Selector Setting Label (${setting.key})`,
    defaultMessage:
      defaultMessages[`otpUi.ModeSelector.settings.${setting.key}-label`]
  });

  switch (setting.type) {
    case "CHECKBOX":
      return (
        <SubSettingsCheckbox
          label={label}
          name={setting.key}
          onChange={onChange}
          value={setting.value}
        />
      );
    case "DROPDOWN":
      return (
        <DropdownSelector
          label={label}
          name={setting.key}
          onChange={onChange}
          options={setting.options.map(o => ({
            ...o,
            text: intl.formatMessage({
              id: `otpUi.ModeSelector.settings.${setting.key}-options-${o.value}`,
              description: `Metro Mode Selector Setting (${setting.key}) Option Label (${o.value})`
            })
          }))}
          value={setting.value}
        />
      );
    case "SLIDER":
      return (
        <SliderSelector
          label={label}
          labelHigh={intl.formatMessage({
            id: `otpUi.ModeSelector.settings.${setting.key}-labelHigh`,
            description: `Metro Mode Selector Setting Label High (${setting.key})`
          })}
          labelLow={intl.formatMessage({
            id: `otpUi.ModeSelector.settings.${setting.key}-labelLow`,
            description: `Metro Mode Selector Setting Label Low (${setting.key})`
          })}
          max={setting.high}
          min={setting.low}
          name={setting.key}
          onChange={(event: QueryParamChangeEvent) => {
            // If an inverse key is specified, calculate its value here
            if (setting.inverseKey) {
              event[setting.inverseKey] =
                setting.high - Number(event[setting.key]) + setting.low;
            }
            onChange(event);
          }}
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
  onDisableMode: () => void;
  onDismiss: () => void;
  onSettingUpdate: (QueryParamChangeEvent) => void;
  showControls: boolean;
}
export default function SubSettingsPane({
  modeButton,
  onDisableMode,
  onSettingUpdate,
  showControls
}: Props): ReactElement {
  const intl = useIntl();
  const label = generateModeButtonLabel(modeButton.key, intl);
  return (
    <SettingsPanel>
      <Header>
        <span id={`metro-mode-selector-${modeButton.key}-button-label`}>
          {label}
        </span>
        {showControls && (
          <DisableButton type="button" onClick={onDisableMode}>
            Disable {label} <CircleXmark size={16} />
          </DisableButton>
        )}
      </Header>
      {modeButton.modeSettings?.map(setting => (
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
