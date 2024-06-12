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

const { blue, grey } = colors;

interface Props {
  accentColor?: string;
  modeButton: ModeButtonDefinition;
  onSettingsUpdate: () => void;
  id: string;
  onToggle: () => void;
}

const SettingsContainer = styled.div`
  width: 100%;
  max-width: 500px;
`;

const StyledModeSettingsButton = styled.div<{ accentColor: string }>`
  & > input {
    ${invisibleCss}
  }
  & > label {
    width: 100%;
    background-color: #fff;
    color: ${props => props.accentColor};
    height: 51px;
    border: 1px solid ${props => props.accentColor};
    border-left-width: 2px;
    border-right-width: 2px;
    display: grid;
    grid-template-columns: 40px auto 40px;
    gap: 20px;
    align-items: center;
    justify-items: center;
  }

  & > input:checked + label {
    background-color: ${props => props.accentColor};
    color: #fff;
  }

  span {
    justify-self: flex-start;
  }

  svg {
    height: 24px;
    width: 24px;
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

const ModeSettingsButton = ({
  accentColor = blue[700],
  modeButton,
  onSettingsUpdate,
  onToggle,
  id
}: Props) => {
  const intl = useIntl();
  const label = generateModeButtonLabel(modeButton.key, intl, modeButton.label);
  const checkboxId = `metro-submode-selector-mode-${id}`;
  return (
    <SettingsContainer>
      <StyledModeSettingsButton accentColor={accentColor} id={modeButton.key}>
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

export default ModeSettingsButton;
