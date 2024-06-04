import styled from "styled-components";
import React, { useCallback } from "react";
import { ModeButtonDefinition } from "@opentripplanner/types";
import ModeSettingsButton from "./ModeSettingsButton";

const SubsettingsContainer = styled.fieldset`
  border: none;
  width: 90%;
  margin: 0;

  legend {
    display: none;
  }

  display: flex;
  flex-direction: column;

  div:first-of-type div label {
    border-top-width: 2px;
  }

  div:last-of-type div label {
    border-bottom-width: 2px;
  }
`;

interface Props {
  fillModeIcons: any;
  label: string;
  modeButtons: ModeButtonDefinition[];
  onSettingsUpdate: any;
  onToggleModeButton: any;
}

const ModeSubsettingsContainer = ({
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
          <ModeSettingsButton
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

export default ModeSubsettingsContainer;
