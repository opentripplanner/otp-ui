import React, {
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import styled from "styled-components";
import getEntryRelativeTo from "./get-entry-relative-to";
import grey from "../colors/grey";

const DARK_TEXT_GREY = "#333";

export interface Props extends HTMLAttributes<HTMLElement> {
  id: string;
  label?: string;
  listLabel?: string;
  isList?: boolean;
  name?: JSX.Element | string;
  nav?: boolean;
  pullRight?: boolean;
}

const DropdownButton = styled.button`
  background: #fff;
  border: 1px solid black;
  color: inherit;
  border-radius: 5px;
  padding: 3px 7px;
  display: block;
  float: right;
  line-height: 20px;
  transition: all 0.1s ease-in-out;

  span.caret {
    color: inherit;
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 5px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }

  &:hover,
  &[aria-expanded="true"] {
    background: ${grey[50]};
    color: black;
    cursor: pointer;
  }
`;

const DropdownMenu = styled.div`
  background-clip: padding-box;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  color: ${DARK_TEXT_GREY};
  list-style: none;
  margin: 2px 0 0;
  min-width: 160px;
  padding: 5px 0;
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  z-index: 1000;

  hr {
    margin: 0;
    padding: 0;
  }
  a,
  button {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 5px 15px;
    text-align: start;
    width: 100%;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
`;

const DropdownWrapper = styled.span<{ pullRight?: boolean }>`
  float: ${props => (props.pullRight ? "right" : "left")};
  position: relative;
`;

/**
 * Renders a dropdown menu. By default, only a passed "name" is rendered. If clicked,
 * a floating div is rendered below the "name" with list contents inside. Clicking anywhere
 * outside the floating div will close the dropdown.
 */
export const Dropdown = ({
  children,
  className,
  id,
  label,
  listLabel,
  isList,
  name,
  pullRight,
  style
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
          getEntryRelativeTo(queryId, element, -1)?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          getEntryRelativeTo(queryId, element, 1)?.focus();
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
      role="presentation"
    >
      <DropdownButton
        // Only set aria-controls when the dropdown is open
        // (otherwise, assistive technologies may not announce the dropdown correctly).
        aria-controls={open ? id : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className={`${open && "active"}`}
        id={`${id}-label`}
        onClick={toggleOpen}
        style={style}
        tabIndex={0}
        title={label}
      >
        <span>{name}</span>
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
