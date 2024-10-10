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
`;

const StyledModeSettingsButton = styled.div<{
  accentColor: string;
  fillModeIcons: boolean;
  subsettings: boolean;
}>`
  & > label {
    align-items: center;
    background-color: #fff;
    border: 2px solid ${props => props.accentColor};
    border-left-width: 2px;
    border-right-width: 2px;
    color: ${props => props.accentColor};
    cursor: pointer;
    display: grid;
    font-size: 18px;
    font-weight: 400;
    gap: 20px;
    grid-template-columns: 40px auto 40px;
    height: 51px;
    justify-items: center;
    margin-bottom: 0;
    margin-top: -2px;
    padding: 0 10px;
  }
  & > input {
    ${invisibleCss}

    &:checked + label {
      background-color: ${props => props.accentColor};
      color: #fff;
      border-bottom-left-radius: ${props => props.subsettings && 0} !important;
      border-bottom-right-radius: ${props => props.subsettings && 0} !important;
    }

    &:focus-visible + label,
    &:focus + label {
      outline: ${props => props.accentColor} 1px solid;
      outline-offset: -4px;
    }
  }

  & > input:checked {
    &:focus-visible + label,
    &:focus + label {
      outline: white 1px solid;
    }
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
  onAllSubmodesDisabled?: (modeButton: ModeButtonDefinition) => void;
  onSettingsUpdate: (event: QueryParamChangeEvent) => void;
  onToggle: () => void;
}

const AdvancedModeSettingsButton = ({
  accentColor = blue[700],
  fillModeIcons,
  id,
  modeButton,
  onSettingsUpdate,
  onAllSubmodesDisabled,
  onToggle
}: Props): JSX.Element => {
  const intl = useIntl();
  const label = generateModeButtonLabel(modeButton.key, intl, modeButton.label);
  const checkboxId = `metro-submode-selector-mode-${id}`;
  return (
    <SettingsContainer className="advanced-submode-container">
      <StyledModeSettingsButton
        accentColor={accentColor}
        className="advanced-submode-mode-button"
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
        <AnimateHeight duration={300} height={modeButton.enabled ? "auto" : 0}>
          <StyledSettingsContainer className="subsettings-container">
            <SubSettingsPane
              onSettingUpdate={onSettingsUpdate}
              modeButton={modeButton}
              onAllSubmodesDisabled={onAllSubmodesDisabled}
            />
          </StyledSettingsContainer>
        </AnimateHeight>
      )}
    </SettingsContainer>
  );
};

export default AdvancedModeSettingsButton;
