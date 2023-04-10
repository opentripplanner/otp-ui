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
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";

import SubSettingsPane, { defaultMessages } from "./SubSettingsPane";
import generateModeButtonLabel from "./i18n";

const invisibleCss = css`
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

const defaultAccentColor = "#084c8d";
const defaultActiveHoverColor = "#0e5faa";

const boxShadowCss = css`
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05), 0 4px 20px rgba(14, 95, 170, 0.15);
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
    right: 4px;
  }

  & > button:focus {
    clip: initial;
    height: initial;
    width: initial;
  }

  & > input:checked + label {
    background: ${defaultAccentColor};
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

const HoverPanel = styled.div`
  min-width: 300px;
  padding: 0 10px;
  width: 75%;
  z-index: 10;
`;

const HoverInnerContainer = styled.div`
  background: #fff;
  border-radius: 4px;
  color: #2e2e2e;
  font-size: 90%;
  font-weight: bold;
  padding: 10px 15px 15px 15px;
  pointer-events: none;
  ${boxShadowCss}
`;

const Arrow = styled.div`
  background: #fff;
  height: 10px;
  margin-top: -5px;
  position: absolute;
  transform: rotate(-45deg);
  width: 10px;
  ${boxShadowCss}
`;

interface ModeButtonProps {
  // Optional properties for styling
  accentColor?: string;
  activeHoverColor?: string;

  fillModeIcons?: boolean;
  id: string;
  itemWithKeyboard?: string;
  modeButton: ModeButtonDefinition;
  onPopupClose: () => void;
  onPopupKeyboardExpand: (id: string) => void;
  onSettingsUpdate: (QueryParamChangeEvent) => void;
  onToggle: () => void;
}

function ModeButton({
  accentColor,
  activeHoverColor,
  fillModeIcons,
  id,
  itemWithKeyboard,
  modeButton,
  onPopupClose,
  onPopupKeyboardExpand,
  onSettingsUpdate,
  onToggle
}: ModeButtonProps) {
  const intl = useIntl();

  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  const onOpenChange = useCallback(
    value => {
      setOpen(value);
      if (!value && typeof onPopupClose === "function") {
        onPopupClose();
      }
    },
    [onPopupClose, setOpen]
  );
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
    onOpenChange,
    open
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useHover(context, {
      // Enable hover only if no popup has been triggered via keyboard.
      // (This is to avoid focus being stolen by hovering out of another button.)
      enabled: itemWithKeyboard === null,
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

  const renderDropdown = open && modeButton.enabled;
  const interactionProps = getReferenceProps();

  // ARIA roles are added by the `useRole` hook.
  // Remove the aria-controls, aria-expanded, and aria-haspopup props from the label, they will
  // instead be passed to the button for keyboard/screen reader users to trigger the popup.
  const {
    "aria-controls": ariaControls,
    "aria-expanded": ariaExpanded,
    "aria-haspopup": ariaHasPopup,
    ...labelInteractionProps
  } = interactionProps;

  const checkboxId = `metro-mode-selector-mode-${id}`;

  const handleButtonClick = useCallback(
    e => {
      if (typeof onPopupKeyboardExpand === "function") {
        onPopupKeyboardExpand(id);
      }
      if (typeof interactionProps.onClick === "function") {
        interactionProps.onClick(e);
      }
    },
    [id, interactionProps, onPopupKeyboardExpand]
  );

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
        {...labelInteractionProps}
        htmlFor={checkboxId}
        // This will trigger mouse effects such as showing popup on hover of on check.
        ref={reference}
        title={label}
      >
        <modeButton.Icon role="none" size={32} />
        <InvisibleA11yLabel>{label}</InvisibleA11yLabel>
      </label>
      <button
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...interactionProps}
        // Disable button if mode is not checked (but keep in DOM for screen reader awareness)
        disabled={!modeButton.enabled}
        // Separate handler to communicate to the parent element
        // which item had a popup triggered using the keyboard.
        onClick={handleButtonClick}
        // Required by linter settings
        type="button"
      >
        <span role="none">
          {open ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </span>
        <InvisibleA11yLabel>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.ModeSelector.settingsLabel"]}
            description="Label for the button to open settings for a travel mode."
            id="otpUi.ModeSelector.settingsLabel"
            values={{ mode: label }}
          />
        </InvisibleA11yLabel>
      </button>
      {renderDropdown && (
        <FloatingFocusManager
          context={context}
          // Restore the keyboard focus AND show focus cue on hovering out of the label
          // only if this component triggered the popup using the keyboard.
          // (Don't show focus cue if the popup was not triggered via keyboard.)
          returnFocus={itemWithKeyboard === id}
        >
          <HoverPanel
            // This library relies on prop spreading
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...getFloatingProps()}
            // Matches ID on Header element in SubSettingsPane
            aria-labelledby={`metro-mode-selector-${modeButton.key}-button-label`}
            ref={floating}
            style={{
              left: x ?? 0,
              position: strategy,
              top: y ?? 0
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
  onToggleModeButton: (key: string) => void;
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
  // State that holds the id of the active mode combination popup that was triggered via keyboard.
  // It is used to enable/disable hover effects to avoid keyboard focus being stolen
  // and overlapping popups on mouse hover.
  const [itemWithKeyboard, setItemWithKeyboard] = useState<string>(null);
  return (
    <ModeBar className="metro-mode-selector">
      <legend>{label}</legend>
      {modeButtons.map(button => (
        <ModeButton
          accentColor={accentColor}
          activeHoverColor={activeHoverColor}
          fillModeIcons={fillModeIcons}
          id={button.key}
          itemWithKeyboard={itemWithKeyboard}
          key={button.label}
          modeButton={button}
          onPopupClose={useCallback(() => {
            setItemWithKeyboard(null);
          }, [setItemWithKeyboard])}
          onPopupKeyboardExpand={setItemWithKeyboard}
          onSettingsUpdate={onSettingsUpdate}
          onToggle={useCallback(() => {
            onToggleModeButton(button.key);
          }, [button, onToggleModeButton])}
        />
      ))}
    </ModeBar>
  );
}
