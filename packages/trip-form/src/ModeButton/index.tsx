import CSS from "csstype";
import React, { ReactElement, ReactNode } from "react";

import * as S from "../styled";

interface ModeButtonProps {
  /**
   * The contents of the button. Can be any HTML/React content.
   */
  children: ReactNode;
  /**
   * The CSS class name to apply to this element.
   */
  className?: string;
  /**
   * Determines whether the button is currently enabled.
   */
  enabled?: boolean;
  /**
   * Triggered when the user clicks the button.
   */
  onClick?: (InputEvent) => void;
  /**
   * Determines whether the button should appear selected.
   */
  selected?: boolean;
  /**
   * Determines whether the title should be displayed (underneath the button).
   */
  showTitle?: boolean;
  /**
   * A title text for the button, displayed as popup when the user hover the mouse over the button,
   * and optionally displayed underneath the button if showTitle is true.
   */
  title?: string;
  /**
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
}

/**
 * ModeButton lets the user pick a travel mode.
 * It includes the actual button that supports HTML/React text and graphics,
 * and a title displayed when hovering the mouse over the button, and, optionally, underneath it.
 * A ModeButton can be enabled or disabled, active or inactive.
 */
export default function ModeButton({
  className = null,
  children = null,
  enabled = true,
  onClick = null,
  selected = false,
  showTitle = true,
  title = null,
  style = null
}: ModeButtonProps): ReactElement {
  const activeClassName = selected ? "active" : "";
  const disabledClassName = enabled ? "" : "disabled";

  return (
    <S.ModeButton className={className} style={style}>
      <S.ModeButton.Button
        aria-pressed={selected}
        className={`${activeClassName} ${disabledClassName}`}
        disabled={!enabled}
        onClick={onClick}
        title={title}
      >
        {children}
      </S.ModeButton.Button>

      {title && showTitle && (
        <S.ModeButton.Title
          className={`${activeClassName} ${disabledClassName}`}
          title={title}
        >
          {title}
        </S.ModeButton.Title>
      )}
    </S.ModeButton>
  );
}
