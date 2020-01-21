import React from "react";
import PropTypes from "prop-types";

import * as Styled from "../styled";

/**
 * ModeButton lets the user pick a travel mode.
 * It includes the actual button that supports HTML/React text and graphics,
 * and a title displayed when hovering the mouse over the button, and, optionally, underneath it.
 * A ModeButton can be enabled or disabled, active or inactive.
 */
const ModeButton = props => {
  const {
    className,
    selected,
    children,
    enabled,
    showTitle,
    title,
    onClick
  } = props;

  const activeClassName = selected ? "active" : "";
  const disabledClassName = enabled ? "" : "disabled";

  return (
    <Styled.ModeButtonContainer className={className}>
      <Styled.ModeButtonButton
        className={`${activeClassName} ${disabledClassName}`}
        onClick={onClick}
        title={title}
        disabled={!enabled}
      >
        {children}
      </Styled.ModeButtonButton>

      {title && showTitle && (
        <Styled.ModeButtonTitle className={disabledClassName} title={title}>
          {title}
        </Styled.ModeButtonTitle>
      )}
    </Styled.ModeButtonContainer>
  );
};

ModeButton.propTypes = {
  /**
   * The contents of the button. Can be any HTML/React content.
   */
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  /**
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  /**
   * Determines whether the button is currently enabled.
   */
  enabled: PropTypes.bool,
  /**
   * Triggered when the user clicks the button.
   */
  onClick: PropTypes.func,
  /**
   * Determines whether the button should appear selected.
   */
  selected: PropTypes.bool,
  /**
   * Determines whether the title should be displayed (underneath the button).
   */
  showTitle: PropTypes.bool,
  /**
   * A title text for the button, displayed as popup when the user hover the mouse over the button,
   * and optionally displayed underneath the button if showTitle is true.
   */
  title: PropTypes.string
};

ModeButton.defaultProps = {
  children: null,
  className: null,
  enabled: true,
  onClick: null,
  selected: false,
  showTitle: true,
  title: null
};

export default ModeButton;
