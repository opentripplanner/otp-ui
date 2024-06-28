import React, {
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { getNextSibling, getPreviousSibling } from "../utils/dom-query";
import { DropdownButton, DropdownMenu, DropdownWrapper } from "./styled";

export interface Props extends HTMLAttributes<HTMLElement> {
  buttonStyle?: React.CSSProperties;
  isList?: boolean;
  label?: string;
  listLabel?: string;
  text?: JSX.Element | string;
  nav?: boolean;
  pullRight?: boolean;
}

/**
 * Renders a dropdown menu. By default, only a passed "text" is rendered. If clicked,
 * a floating div is rendered below the "text" with list contents inside. Clicking anywhere
 * outside the floating div will close the dropdown.
 */
export const Dropdown = ({
  children,
  className,
  id,
  isList,
  label,
  listLabel,
  text,
  pullRight,
  buttonStyle
}: Props): JSX.Element => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);

  const toggleOpen = useCallback(() => setOpen(!open), [open, setOpen]);

  // Argument for document.querySelectorAll to target focusable elements.
  const queryId = `#${id} button, #${id}-label`;

  // Adding document event listeners allows us to close the dropdown
  // when the user interacts with any part of the page that isn't the dropdown
  useEffect(() => {
    const handleExternalAction = (e: Event): void => {
      if (!containerRef?.current?.contains(e.target as HTMLElement)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleExternalAction);
    document.addEventListener("focusin", handleExternalAction);
    document.addEventListener("keydown", handleExternalAction);
    return () => {
      document.removeEventListener("mousedown", handleExternalAction);
      document.removeEventListener("focusin", handleExternalAction);
      document.removeEventListener("keydown", handleExternalAction);
    };
  }, [containerRef]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      const element = e.target as HTMLElement;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          getPreviousSibling(queryId, element)?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          getNextSibling(queryId, element)?.focus();
          break;
        case "Escape":
          setOpen(false);
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          element.click();
          if (element.id === `${id}-label` || element.id === `${id}-wrapper`) {
            toggleOpen();
          }
          break;
        default:
      }
    },
    [id, toggleOpen]
  );

  return (
    <DropdownWrapper
      className={className}
      id={`${id}-wrapper`}
      onKeyDown={handleKeyDown}
      pullRight={pullRight}
      ref={containerRef}
    >
      <DropdownButton
        // Only set aria-controls when the dropdown is open
        // (otherwise, assistive technologies may not announce the dropdown correctly).
        aria-controls={open ? id : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        id={`${id}-label`}
        onClick={toggleOpen}
        style={buttonStyle}
        title={label}
      >
        <span>{text}</span>
        <span className="caret" role="presentation" />
      </DropdownButton>
      {open && (
        <DropdownMenu
          as={isList && "ul"}
          aria-label={listLabel}
          aria-labelledby={listLabel ? undefined : `${id}-label`}
          id={id}
          onClick={toggleOpen}
          role={isList && "list"}
          tabIndex={-1}
        >
          {children}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
};
