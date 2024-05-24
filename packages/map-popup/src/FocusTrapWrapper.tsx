import React, { ReactNode, useCallback } from "react";

function getEntries(query: string) {
  const entries = Array.from(document.querySelectorAll(query));
  const firstElement = entries[0];
  const lastElement = entries[entries.length - 1];

  return { entries, firstElement, lastElement };
}

/**
 * Helper method to find the next focusable sibling element relative to the
 * specified element.
 *
 * @param {string} query  - Argument that gets passed to document.querySelectorAll
 * @param {HTMLElement} element - Specified element (e.target)
 * @returns {HTMLElement} - element to be focused
 */
export function getNextSibling(
  query: string,
  element: EventTarget
): HTMLElement {
  const { entries, firstElement, lastElement } = getEntries(query);

  if (element === lastElement) {
    return firstElement as HTMLElement;
  }
  const elementIndex = entries.indexOf(element as HTMLElement);
  return entries[elementIndex + 1] as HTMLElement;
}

/**
 * Helper method to find the previous focusable sibling element relative to the
 * specified element.
 *
 * @param {string} query  - Argument that gets passed to document.querySelectorAll
 * @param {HTMLElement} element - Specified element (e.target)
 * @returns {HTMLElement} - element to be focused
 */
export function getPreviousSibling(
  query: string,
  element: EventTarget
): HTMLElement {
  const { entries, firstElement, lastElement } = getEntries(query);

  if (element === firstElement) {
    return lastElement as HTMLElement;
  }
  const elementIndex = entries.indexOf(element as HTMLButtonElement);
  return entries[elementIndex - 1] as HTMLElement;
}

const FocusTrapWrapper = ({
  children,
  closePopup = null,
  id
}: {
  children: ReactNode | ReactNode[];
  closePopup?: (arg?: boolean) => void;
  id: string;
}): JSX.Element => {
  const queryId = `#${id}-popup-focus-trap button`;
  const handleKeyDown = useCallback(
    e => {
      const element = e.target as HTMLElement;
      switch (e.key) {
        case "Escape":
          closePopup();
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            getPreviousSibling(queryId, element)?.focus();
          } else {
            getNextSibling(queryId, element)?.focus();
          }
          break;
        default:
      }
    },
    [closePopup]
  );

  return (
    <div
      id={`${id}-popup-focus-trap`}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      {children}
    </div>
  );
};

export default FocusTrapWrapper;
