import styled from "styled-components";
import React, { useCallback } from "react";
import { ModeButtonDefinition } from "@opentripplanner/types";
import AdvancedModeSettingsButton from "./AdvancedModeSettingsButton";
import { invisibleCss } from ".";

const SubsettingsContainer = styled.fieldset`
  border: none;
  margin: 0;
  width: 90%;

  legend {
    ${invisibleCss}
  }

  display: flex;
  flex-direction: column;

  div:first-of-type div label {
    border-top-width: 2px;
    border-radius: 8px 8px 0 0;
  }

  div:last-of-type div label {
    border-bottom-width: 2px;
    border-radius: 0 0 8px 8px;
  }
`;

interface Props {
  fillModeIcons: any;
  label: string;
  modeButtons: ModeButtonDefinition[];
  onSettingsUpdate: any;
  onToggleModeButton: any;
}

const AdvancedModeSubsettingsContainer = ({
  modeButtons,
  label,
  onSettingsUpdate,
  onToggleModeButton
}: Props): JSX.Element => {
  return (
    <SubsettingsContainer>
      <legend>{label}</legend>
      {modeButtons.map(button => {
        return (
          <AdvancedModeSettingsButton
            key={button.label}
            modeButton={button}
            onSettingsUpdate={onSettingsUpdate}
            onToggle={useCallback(() => {
              onToggleModeButton(button.key, !button.enabled);
            }, [button, onToggleModeButton])}
            id={button.key}
          />
        );
      })}
    </SubsettingsContainer>
  );
};

export default AdvancedModeSubsettingsContainer;
