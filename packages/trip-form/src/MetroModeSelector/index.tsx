import { ModeButtonDefinition } from "@opentripplanner/types";
import React, { ReactElement, useCallback } from "react";
import { useIntl } from "react-intl";
import styled, { css } from "styled-components";

import generateModeButtonLabel from "./i18n";

export const invisibleCss = css`
  clip: rect(0, 0, 0, 0);
  height: 0;
  overflow: hidden;
  position: absolute;
  width: 0;
`;

const InvisibleA11yLabel = styled.span`
  display: inline-block;
  ${invisibleCss}
`;

const ModeBar = styled.fieldset`
  border: none;
  display: inline-flex;
  gap: 0 3px;
  margin: 0 4px 0 0;
  padding: 0;

  /* <legend> is not shown visually. */
  & > legend {
    ${invisibleCss}
  }
`;

const defaultAccentColor = "#666";
const defaultActiveHoverColor = "#333";

const boxShadowCss = css`
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 20px;
`;

const ModeButtonWrapper = styled.span<{
  fillModeIcons?: boolean;
  accentColor?: string;
  activeHoverColor?: string;
}>`
  position: relative;

  & > label {
    background: #fff;
    border-radius: 5px;
    border: 2px solid ${props => props.accentColor || defaultAccentColor};
    cursor: pointer;
    display: inline-flex;
    padding: 0.75rem 0.75rem;
    transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);
    user-select: none;
    justify-content: center;
    aspect-ratio: 1/1; /* stylelint-disable-line property-no-unknown */
  }

  &:not(:last-of-type) > label {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  &:not(:first-of-type) > label {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  & > label:hover {
    background: #eee;
    border-color: ${props => props.activeHoverColor || defaultActiveHoverColor};
    ${boxShadowCss}
  }

  & > input {
    ${invisibleCss}
    /* Firefox will still render (tiny) controls, even if their bounds are empty,
       so move them out of sight. */
    left: -20px;
    position: absolute;
  }

  & > button {
    ${invisibleCss}
    background: none;
    border: none;
    /* Lateral position is offset so that the button outline is visible when focused. */
    bottom: 0;
    left: 4px;
    position: absolute;
  }

  & > button:focus {
    clip: initial;
    height: initial;
    width: calc(100% - 8px);
  }

  & > input:checked + label {
    background: ${props => props.accentColor || defaultAccentColor};
  }

  & > input:checked + label,
  & > input:checked ~ button {
    color: white;
    fill: ${props =>
      props.fillModeIcons === false ? "inherit" : "currentcolor"};
  }

  & > input:focus + label {
    outline: 5px auto blue;
    /* This next line enhances the visuals in Chromium (webkit) browsers */
    outline: 5px auto -webkit-focus-ring-color;
    /* Render the focus outline inside and distinct from the border for both Chrome and Firefox. */
    outline-offset: -4px;
  }

  & > input:checked + label:hover {
    background: ${props => props.activeHoverColor || defaultActiveHoverColor};
  }

  & > label > svg {
    color: ${props => props.accentColor || defaultAccentColor};
    display: inline-block;
    height: 32px;
    margin: auto;
    vertical-align: middle;
    width: 32px;
    fill: ${props =>
      props.fillModeIcons === false ? "inherit" : "currentcolor"};
  }

  & > input:checked + label > svg {
    color: #eee;
  }
`;

interface ModeButtonProps {
  // Optional properties for styling
  accentColor?: string;
  activeHoverColor?: string;

  fillModeIcons?: boolean;
  id: string;
  modeButton: ModeButtonDefinition;
  onSettingsUpdate: (QueryParamChangeEvent) => void;
  onToggle: () => void;
}

function ModeButton({
  accentColor,
  activeHoverColor,
  fillModeIcons,
  id,
  modeButton,
  onToggle
}: ModeButtonProps) {
  const intl = useIntl();

  const checkboxId = `metro-mode-selector-mode-${id}`;

  const label = generateModeButtonLabel(modeButton.key, intl, modeButton.label);

  return (
    <ModeButtonWrapper
      accentColor={accentColor}
      activeHoverColor={activeHoverColor}
      fillModeIcons={fillModeIcons}
    >
      {/* Basic checkbox that states whether a mode is selected. */}
      <input
        aria-label={label}
        checked={modeButton.enabled ?? undefined}
        id={checkboxId}
        onChange={onToggle}
        type="checkbox"
      />
      {/* Label for the above checkbox, placed right after, so that CSS applies based on checkbox state. */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        // This library relies on prop spreading
        // eslint-disable-next-line react/jsx-props-no-spreading
        htmlFor={checkboxId}
        // This will trigger mouse effects such as showing popup on hover of on check.
        title={label}
      >
        <modeButton.Icon aria-hidden size={32} />
        <InvisibleA11yLabel>{label}</InvisibleA11yLabel>
      </label>
    </ModeButtonWrapper>
  );
}
interface Props {
  /**
   * Accent color override
   */
  accentColor?: string;
  /**
   * Hover color override
   */
  activeHoverColor?: string;
  /**
   * Apply fill color to the mode icons when the button is selected. (default true)
   */
  fillModeIcons?: boolean;
  /**
   * Text that prompts to select a travel mode.
   */
  label?: string;
  /**
   * List of mode buttons to be displayed
   */
  modeButtons?: ModeButtonDefinition[];
  /**
   * Event handler for settings changes
   * @param QueryParamChangeEvent Event from when the mode settings change
   */
  onSettingsUpdate: (QueryParamChangeEvent) => void;
  /**
   * Event for when a mode button is toggled
   * @param key Mode button to be toggled
   */
  onToggleModeButton: (key: string, newState: boolean) => void;
}

export default function ModeSelector({
  accentColor,
  activeHoverColor,
  fillModeIcons,
  label,
  modeButtons = [],
  onSettingsUpdate,
  onToggleModeButton
}: Props): ReactElement {
  return (
    <ModeBar className="metro-mode-selector">
      <legend>{label}</legend>
      {modeButtons.map(button => (
        <ModeButton
          accentColor={accentColor}
          activeHoverColor={activeHoverColor}
          fillModeIcons={fillModeIcons}
          id={button.key}
          key={button.label}
          modeButton={button}
          onSettingsUpdate={onSettingsUpdate}
          onToggle={useCallback(() => {
            onToggleModeButton(button.key, !button.enabled);
          }, [button, onToggleModeButton])}
        />
      ))}
    </ModeBar>
  );
}
