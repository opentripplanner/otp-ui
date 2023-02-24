import {
  arrow,
  FloatingFocusManager,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole
} from "@floating-ui/react";
import { ModeButtonDefinition } from "@opentripplanner/types";
import { CaretDown } from "@styled-icons/fa-solid/CaretDown";
import { CaretUp } from "@styled-icons/fa-solid/CaretUp";
import React, { ReactElement, useCallback, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";

import SubSettingsPane from "./SubSettingsPane";

const invisibleCss = css`
  clip: rect(0, 0, 0, 0);
  height: 0;
  overflow: hidden;
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

const accentColor = "#084c8d";
const activeHoverColor = "0e5faa";

const ModeButtonWrapper = styled.span`
  position: relative;

  & > label {
    background: #fff;
    border-radius: 5px;
    border: 2px solid ${accentColor};
    cursor: pointer;
    display: inline-block;
    padding: 0.75rem 0.75rem;
    transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);
    user-select: none;
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
    border-color: ${activeHoverColor};
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05),
      0 4px 10px rgba(0, 123, 255, 0.25);
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
    /* Position is offset so that the button outline is visible when focused. */
    bottom: 4px;
    left: 4px;
    position: absolute;
    right: 4px;
  }

  & > button:focus {
    clip: initial;
    height: initial;
    width: initial;
  }

  & > input:checked + label {
    background: ${accentColor};
  }

  & > input:checked + label,
  & > input:checked ~ button {
    color: white;
  }

  & > input:focus + label {
    outline: 5px auto blue;
    /* This next line enhances the visuals in Chromium (webkit) browsers */
    outline: 5px auto -webkit-focus-ring-color;
    /* Render the focus outline inside and distinct from the border for both Chrome and Firefox. */
    outline-offset: -4px;
  }

  & > input:checked + label:hover {
    background: ${activeHoverColor};
  }

  & > label > svg {
    color: ${accentColor};
    display: inline-block;
    height: 32px;
    margin: auto;
    vertical-align: middle;
    width: 32px;
  }

  & > input:checked + label > svg {
    color: #eee;
  }
`;

const HoverPanel = styled.div`
  min-width: 300px;
  padding: 0 10px;
  width: 75%;
  z-index: 10;
`;

const HoverInnerContainer = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05), 0 4px 10px rgba(0, 123, 255, 0.25);
  color: #2e2e2e;
  font-size: 90%;
  font-weight: bold;
  padding: 5px;
  pointer-events: none;
`;

const Arrow = styled.div`
  background: #fff;
  height: 10px;
  margin-top: -5px;
  position: absolute;
  transform: rotate(-45deg);
  width: 10px;
`;

interface ModeButtonProps {
  disableHover?: boolean;
  fillModeIcons?: boolean;
  id: string;
  modeButton: ModeButtonDefinition;
  onSettingsUpdate: (QueryParamChangeEvent) => void;
  onToggle: () => void;
}

function ModeButton({
  disableHover,
  id,
  modeButton,
  onSettingsUpdate,
  onToggle
}: ModeButtonProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  const {
    context,
    floating,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    reference,
    strategy,
    x,
    y
  } = useFloating({
    middleware: [offset(8), shift(), arrow({ element: arrowRef })],
    onOpenChange: setOpen,
    open
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useHover(context, {
      enabled: true,
      handleClose: safePolygon({
        blockPointerEvents: false,
        restMs: 500,
        buffer: 0
      })
    }),
    useClick(context),
    useRole(context),
    useDismiss(context)
  ]);

  const disableModeButton = () => {
    if (modeButton.enabled) {
      onToggle();
    }
    setOpen(false);
  };

  const renderDropdown = open && modeButton.enabled;
  const interactionProps = getReferenceProps();

  // ARIA roles are added by the `useRole` hook.
  // Remove the aria-controls, aria-expanded, and aria-haspopup props from the label, they will
  // be passed to the button instead, so it can properly triggered by keyboard or screen readers.
  const {
    "aria-controls": ariaControls,
    "aria-expanded": ariaExpanded,
    "aria-haspopup": ariaHasPopup,
    ...labelInteractionProps
  } = interactionProps;

  return (
    <ModeButtonWrapper>
      <input
        checked={modeButton.enabled ?? undefined}
        id={id}
        onChange={onToggle}
        type="checkbox"
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        // This library relies on prop spreading
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...labelInteractionProps}
        htmlFor={id}
        ref={reference}
        title={modeButton.label}
      >
        <modeButton.Icon size={32} />
        <InvisibleA11yLabel>{modeButton.label}</InvisibleA11yLabel>
      </label>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <button type="button" {...interactionProps}>
        <span role="none">
          {open ? <CaretDown size={14} /> : <CaretUp size={14} />}
        </span>
        <InvisibleA11yLabel>
          <FormattedMessage
            defaultMessage="Settings"
            description="Label for the button to open settings for a travel mode."
            id="otpUi.ModeSelector.settingsLabel"
            values={{ mode: modeButton.label }}
          />
        </InvisibleA11yLabel>
      </button>
      {renderDropdown && (
        <FloatingFocusManager context={context} modal={false}>
          <HoverPanel
            // This library relies on prop spreading
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...getFloatingProps()}
            // Matches ID on Header element in SubSettingsPane
            aria-labelledby={`metro-mode-selector-${modeButton.key}-button-label`}
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0
            }}
          >
            <Arrow
              ref={arrowRef}
              style={{ top: arrowY ?? 0, left: arrowX ?? 0 }}
            />
            <HoverInnerContainer>
              <SubSettingsPane
                modeButton={modeButton}
                onSettingUpdate={onSettingsUpdate}
                showControls={disableHover ?? false}
                onDismiss={() => {
                  setOpen(false);
                }}
                onDisableMode={disableModeButton}
              />
            </HoverInnerContainer>
          </HoverPanel>
        </FloatingFocusManager>
      )}
    </ModeButtonWrapper>
  );
}
interface Props {
  /**
   * Switches mode selector into click rather than hover mode, for mobile use.
   */
  disableHover?: boolean;
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
  onToggleModeButton: (key) => void;
  /**
   * Whether to fill the mode buttons with a color
   */
  fillModeIcons?: boolean;
  /** Text that describes the contents */
  label?: string;
}

export default function ModeSelector({
  onToggleModeButton,
  onSettingsUpdate,
  modeButtons = [],
  disableHover,
  fillModeIcons,
  label
}: Props): ReactElement {
  return (
    <ModeBar className="metro-mode-selector">
      <legend>{label}</legend>
      {modeButtons.map(combination => (
        <ModeButton
          id={combination.key}
          onToggle={useCallback(() => {
            onToggleModeButton(combination.key);
          }, [combination])}
          key={combination.label}
          modeButton={combination}
          onSettingsUpdate={onSettingsUpdate}
          disableHover={disableHover}
          fillModeIcons={fillModeIcons}
        />
      ))}
    </ModeBar>
  );
}
