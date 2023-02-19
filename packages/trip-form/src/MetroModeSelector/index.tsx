import {
  arrow,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole
} from "@floating-ui/react-dom-interactions";
import { ModeButtonDefinition } from "@opentripplanner/types";
import React, { ReactElement, useRef, useState } from "react";
import styled from "styled-components";

import SubSettingsPane from "./SubSettingsPane";

const ModeBar = styled.div`
  display: inline-grid;
  gap: 0 3px;
  grid-auto-flow: column;
  grid-row: 2;
  margin-right: 4px;
`;

const ModeButtonItem = styled.button<{
  fillModeIcons?: boolean;
}>`
  /* stylelint-disable-next-line property-no-unknown */
  aspect-ratio: 1/1;
  background: #fff;
  border-radius: 5px;
  border: 2px solid #084c8d;
  color: white;
  cursor: pointer;
  display: inline-block;
  margin: 0;
  padding: 0.375rem 0.75rem;
  transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);
  user-select: none;

  &:not(:last-child) {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  &:not(:first-child) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  &:hover {
    background: #eee;
    border-color: #0e5faa;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05),
      0 4px 10px rgba(0, 123, 255, 0.25);
  }

  &[aria-checked="true"] {
    background: #084c8d;
  }

  &[aria-checked="true"]:hover {
    background: #0e5faa;
  }

  svg {
    color: #084c8d;
    display: block;
    ${props => props.fillModeIcons && "fill: currentcolor;"}
    height: 32px;
    margin: auto;
    vertical-align: middle;
    width: 32px;
  }

  &[aria-checked="true"] > svg {
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
  floatingTarget?: HTMLDivElement;
  modeButton: ModeButtonDefinition;
  onSettingsUpdate: (QueryParamChangeEvent) => void;
  onToggle: () => void;
}

function ModeButton({
  disableHover,
  fillModeIcons,
  floatingTarget,
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

  const modeButtonClicked = () => {
    if (disableHover) {
      if (!modeButton.enabled) {
        // enable mode button if it's off
        onToggle();
      }
    } else {
      onToggle();
    }
  };

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useHover(context, {
      enabled: !disableHover,
      handleClose: safePolygon({
        blockPointerEvents: false,
        restMs: 500,
        buffer: 0
      })
    }),
    useClick(context, { enabled: disableHover }),
    useRole(context),
    useDismiss(context),
    { reference: { onClick: modeButtonClicked } }
  ]);

  const disableModeButton = () => {
    if (modeButton.enabled) {
      onToggle();
    }
    setOpen(false);
  };

  return (
    <>
      <ModeButtonItem
        className={modeButton.enabled ? "enabled" : ""}
        ref={reference}
        role="checkbox"
        // This library relies on prop spreading
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...getReferenceProps()}
        aria-expanded={undefined}
        aria-checked={modeButton.enabled ?? false}
        aria-label={modeButton.label}
        fillModeIcons={fillModeIcons !== false}
      >
        <modeButton.Icon size={32} />
      </ModeButtonItem>
      <FloatingPortal
        root={floatingTarget}
        id="otp-ui-metro-mode-selector-hover"
      >
        {open && modeButton.enabled && (
          <HoverPanel
            // This library relies on prop spreading
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...getFloatingProps()}
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
        )}
      </FloatingPortal>
    </>
  );
}

interface Props {
  disableHover?: boolean;
  modeButtons?: ModeButtonDefinition[];
  onSettingsUpdate: (QueryParamChangeEvent) => void;
  onToggleModeButton: (key) => void;
  fillModeIcons?: boolean;
}

export default function ModeSelector({
  onToggleModeButton,
  onSettingsUpdate,
  modeButtons = [],
  disableHover,
  fillModeIcons
}: Props): ReactElement {
  const floatingTarget = useRef(null);
  return (
    <>
      <ModeBar className="metro-mode-selector">
        {modeButtons.map(combination => (
          <ModeButton
            onToggle={() => {
              onToggleModeButton(combination.key);
            }}
            key={combination.label}
            modeButton={combination}
            floatingTarget={floatingTarget.current}
            onSettingsUpdate={onSettingsUpdate}
            disableHover={disableHover}
            fillModeIcons={fillModeIcons}
          />
        ))}
      </ModeBar>
      {/* TODO: Get the ref based portal to work, rather than using IDs. */}
      {/* Alternatively, use some fancy CSS. */}
      <div ref={floatingTarget} id="otp-ui-metro-mode-selector-hover" />
    </>
  );
}
