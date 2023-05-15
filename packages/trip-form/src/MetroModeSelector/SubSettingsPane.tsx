import { flatten } from "flat";
import { ModeButtonDefinition, ModeSetting } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import CheckboxSelector from "../CheckboxSelector";
import DropdownSelector from "../DropdownSelector";
import SliderSelector from "../SliderSelector";
import generateModeButtonLabel, { generateModeSettingLabels } from "./i18n";

import defaultEnglishMessages from "../../i18n/en-US.yml";
// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages: Record<string, string> = flatten(
  defaultEnglishMessages
);

const SubmodeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  grid-column: span 2;
`;

const SettingsPanel = styled.fieldset`
  border: none;
  pointer-events: auto;

  div {
    padding: 5px 0;
  }
  .wide {
    grid-column: span 2;
  }
  .slim {
    font-size: 125%;
    font-weight: 125%;
  }

  legend {
    font-size: 1.5em;
    margin-bottom: 0.5rem;
    padding-top: 15px;
  }
`;

export const SubSettingsCheckbox = styled(CheckboxSelector)`
  margin-left: 4px;
  input {
    vertical-align: middle;
  }
`;

const FormLabelIconWrapper = styled.span`
  svg {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
  }
`;

const ModeSettingRenderer = ({
  onChange,
  setting
}: {
  onChange: (QueryParamChangeEvent) => void;
  setting: ModeSetting;
}) => {
  const intl = useIntl();
  const { label, labelHigh, labelLow } = generateModeSettingLabels(
    setting.type,
    setting.key,
    intl,
    setting.label
  );
  const labelWithIcon =
    "icon" in setting ? (
      <FormLabelIconWrapper>
        <span role="none">{setting.icon}</span> {label}
      </FormLabelIconWrapper>
    ) : (
      label
    );

  switch (setting.type) {
    case "CHECKBOX":
    case "SUBMODE":
      return (
        <SubSettingsCheckbox
          label={labelWithIcon}
          name={setting.key}
          onChange={onChange}
          value={setting.value}
        />
      );
    case "DROPDOWN":
      return (
        <DropdownSelector
          label={labelWithIcon}
          name={setting.key}
          onChange={onChange}
          options={setting.options.map(o => ({
            ...o,
            text: intl.formatMessage({
              description: `Metro Mode Selector Setting (${setting.key}) Option Label (${o.value})`,
              id: `otpUi.ModeSelector.settings.${setting.key}-options-${o.value}`,
              defaultMessage: o.text
            })
          }))}
          value={setting.value}
        />
      );
    case "SLIDER":
      return (
        <SliderSelector
          label={label}
          labelHigh={labelHigh}
          labelLow={labelLow}
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
}
export default function SubSettingsPane({
  modeButton,
  onSettingUpdate
}: Props): ReactElement {
  const intl = useIntl();
  const label = generateModeButtonLabel(modeButton.key, intl, modeButton.label);

  // Split the mode settings out based on whether they're submodes or not
  // This is so we can display submodes in a grid at the top
  const {
    settingsNoSubmodes,
    settingsOnlySubmodes
  } = modeButton.modeSettings.reduce(
    (accumulator, cur) => {
      if (cur.type === "SUBMODE") {
        accumulator.settingsOnlySubmodes.push(cur);
      } else {
        accumulator.settingsNoSubmodes.push(cur);
      }
      return accumulator;
    },
    { settingsNoSubmodes: [], settingsOnlySubmodes: [] }
  );

  return (
    <SettingsPanel>
      <legend>
        <span id={`metro-mode-selector-${modeButton.key}-button-label`}>
          {label}
        </span>
      </legend>
      <SubmodeGrid>
        {settingsOnlySubmodes.map(setting => (
          <ModeSettingRenderer
            key={setting.key}
            onChange={onSettingUpdate}
            setting={setting}
          />
        ))}
      </SubmodeGrid>
      {settingsNoSubmodes.map(setting => (
        <ModeSettingRenderer
          key={setting.key}
          onChange={onSettingUpdate}
          setting={setting}
        />
      ))}
    </SettingsPanel>
  );
}
