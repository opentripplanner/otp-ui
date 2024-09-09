import styled from "styled-components";
import React, { useCallback } from "react";
import { ModeButtonDefinition } from "@opentripplanner/types";
import colors from "@opentripplanner/building-blocks";
import AdvancedModeSettingsButton from "./AdvancedModeSettingsButton";
import { invisibleCss } from ".";
import { QueryParamChangeEvent } from "../types";

const { grey } = colors;

const SubsettingsContainer = styled.fieldset`
  border: none;
  margin: 0;

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

  div.advanced-submode-container:last-of-type div.subsettings-container {
    border-radius: 0 0 8px 8px;
    border-bottom: 1px solid ${grey[300]};
  }
`;

interface Props {
  accentColor?: string;
  fillModeIcons: boolean | undefined;
  label: string;
  modeButtons: ModeButtonDefinition[];
  onAllSubmodesDisabled?: (modeButton: ModeButtonDefinition) => void;
  onSettingsUpdate: (event: QueryParamChangeEvent) => void;
  onToggleModeButton: (key: string, newState: boolean) => void;
}

const AdvancedModeSubsettingsContainer = ({
  accentColor,
  fillModeIcons,
  modeButtons,
  label,
  onAllSubmodesDisabled,
  onSettingsUpdate,
  onToggleModeButton
}: Props): JSX.Element => {
  return (
    <SubsettingsContainer>
      <legend>{label}</legend>
      {modeButtons.map(button => {
        return (
          <AdvancedModeSettingsButton
            accentColor={accentColor}
            fillModeIcons={fillModeIcons}
            key={button.label}
            modeButton={button}
            onSettingsUpdate={onSettingsUpdate}
            onAllSubmodesDisabled={onAllSubmodesDisabled}
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
