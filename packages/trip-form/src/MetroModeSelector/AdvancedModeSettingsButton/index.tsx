import React from "react";
import AnimateHeight from "react-animate-height";
import styled from "styled-components";
import colors from "@opentripplanner/building-blocks";
import { Check2 } from "@styled-icons/bootstrap";
import { ModeButtonDefinition } from "@opentripplanner/types";
import { useIntl } from "react-intl";
import SubSettingsPane from "../SubSettingsPane";
import generateModeButtonLabel from "../i18n";
import { invisibleCss } from "..";
import { QueryParamChangeEvent } from "../../types";

const { blue, grey } = colors;

const SettingsContainer = styled.div`
  width: 100%;
  max-width: 500px;
`;

const StyledModeSettingsButton = styled.div<{
  accentColor: string;
  fillModeIcons: boolean;
  subsettings: boolean;
}>`
  & > input {
    ${invisibleCss}
  }
  & > label {
    align-items: center;
    background-color: #fff;
    border: 1px solid ${props => props.accentColor};
    border-left-width: 2px;
    border-right-width: 2px;
    color: ${props => props.accentColor};
    display: grid;
    gap: 20px;
    grid-template-columns: 40px auto 40px;
    height: 51px;
    justify-items: center;
    padding: 0 10px;
  }

  & > input:checked + label {
    background-color: ${props => props.accentColor};
    color: #fff;
    border-bottom-left-radius: ${props => props.subsettings && 0} !important;
    border-bottom-right-radius: ${props => props.subsettings && 0} !important;
  }

  span {
    justify-self: flex-start;
  }

  svg {
    height: 26px;
    width: 26px;
    fill: ${props =>
      props.fillModeIcons === false ? "inherit" : "currentcolor"};
  }

  &:hover {
    cursor: pointer;
  }
`;

const StyledSettingsContainer = styled.div`
  border: 1px solid ${grey[300]};
  border-top: 0;
  padding: 1em;
`;

interface Props {
  accentColor?: string;
  fillModeIcons: boolean;
  id: string;
  modeButton: ModeButtonDefinition;
  onSettingsUpdate: (event: QueryParamChangeEvent) => void;
  onToggle: () => void;
}

const AdvancedModeSettingsButton = ({
  accentColor = blue[700],
  fillModeIcons,
  id,
  modeButton,
  onSettingsUpdate,
  onToggle
}: Props): JSX.Element => {
  const intl = useIntl();
  const label = generateModeButtonLabel(modeButton.key, intl, modeButton.label);
  const checkboxId = `metro-submode-selector-mode-${id}`;
  return (
    <SettingsContainer className="advanced-submode-container">
      <StyledModeSettingsButton
        accentColor={accentColor}
        fillModeIcons={fillModeIcons}
        id={modeButton.key}
        subsettings={modeButton.modeSettings.length > 0}
      >
        <input
          aria-label={label}
          checked={modeButton.enabled ?? undefined}
          id={checkboxId}
          onChange={onToggle}
          type="checkbox"
        />
        <label htmlFor={checkboxId}>
          <modeButton.Icon />
          <span>{modeButton?.label}</span>
          {modeButton.enabled && <Check2 />}
        </label>
      </StyledModeSettingsButton>
      {modeButton.modeSettings.length > 0 && (
        <AnimateHeight duration={500} height={modeButton.enabled ? "auto" : 0}>
          <StyledSettingsContainer>
            <SubSettingsPane
              onSettingUpdate={onSettingsUpdate}
              modeButton={modeButton}
            />
          </StyledSettingsContainer>
        </AnimateHeight>
      )}
    </SettingsContainer>
  );
};

export default AdvancedModeSettingsButton;
