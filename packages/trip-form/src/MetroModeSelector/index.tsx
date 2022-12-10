import {
  useHover,
  useInteractions,
  useFloating,
  offset,
  shift,
  arrow,
  safePolygon,
  FloatingPortal,
  useClick,
  useDismiss,
  useRole
} from "@floating-ui/react-dom-interactions";
import { ModeButtonDefinition } from "@opentripplanner/types";

import React, { ReactElement, useRef, useState } from "react";
import styled from "styled-components";
import SubSettingsPane from "./SubSettingsPane";

const ModeBar = styled.div`
  display: inline-grid;
  gap: 0;
  grid-auto-flow: column;
`;

const ModeButtonItem = styled.button<{ enabled?: boolean }>`
  display: inline-block;
  /* stylelint-disable-next-line property-no-unknown */
  aspect-ratio: 1/1;
  cursor: pointer;
  margin: 0;
  user-select: none;
  border: 1px solid #0062cc;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  background: ${props => (props.enabled ? "#007bff" : "#004691")};
  transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);
  color: white;

  &:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:hover {
    background: ${props => (props.enabled ? "#006fe6" : "#0355ad")};
    border-color: #006fe6;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05),
      0 4px 10px rgba(0, 123, 255, 0.25);
  }

  svg {
    display: block;
    margin: auto;
    width: 32px;
    height: 32px;
    vertical-align: middle;
    fill: currentcolor;
    color: white;
  }
`;

const HoverPanel = styled.div`
  z-index: 10;
  width: 100%;
  padding: 0 10px;
`;

const HoverInnerContainer = styled.div`
  background: #006fe6;
  color: white;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  font-size: 90%;
  pointer-events: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05), 0 4px 10px rgba(0, 123, 255, 0.25);
`;

const Arrow = styled.div`
  position: absolute;
  background: #006fe6;
  width: 10px;
  height: 10px;
  margin-top: -5px;
  transform: rotate(-45deg);
`;

interface ModeButtonProps {
  floatingTarget: HTMLDivElement;
  disableHover?: boolean;
  modeButton: ModeButtonDefinition;
  onSettingsUpdate: (QueryParamChangeEvent) => void;
  onToggle: () => void;
}

function ModeButton({
  modeButton,
  floatingTarget,
  onToggle,
  disableHover,
  onSettingsUpdate
}: ModeButtonProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  const {
    context,
    x,
    y,
    reference,
    floating,
    strategy,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} }
  } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), shift(), arrow({ element: arrowRef })]
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
        ref={reference}
        // onClick={modeButtonClicked}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...getReferenceProps()}
        enabled={modeButton.enabled}
      >
        <modeButton.Icon size={32} />
      </ModeButtonItem>
      <FloatingPortal root={floatingTarget} id="foobartest">
        {open && modeButton.enabled && (
          <HoverPanel
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
                showControls={disableHover}
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
  modeButtons: ModeButtonDefinition[];
  onSettingsUpdate: (QueryParamChangeEvent) => void;
  onToggleModeButton: (key) => void;
}

export default function ModeSelector({
  onToggleModeButton,
  onSettingsUpdate,
  modeButtons = [],
  disableHover
}: Props): ReactElement {
  const floatingTarget = useRef(null);
  return (
    <>
      <ModeBar>
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
          />
        ))}
      </ModeBar>
      <div ref={floatingTarget} id="foobartest" />
    </>
  );
}
