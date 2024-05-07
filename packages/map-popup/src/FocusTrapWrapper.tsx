import React, { useCallback } from "react";

/**
 * Helper method to find the element within the app menu at the given offset
 * (e.g. previous or next) relative to the specified element.
 *
 * @param {string} query  - Argument that gets passed to document.querySelectorAll
 * @param {HTMLElement} element - Specified element (e.target)
 * @param {1 | -1} offset - Determines direction to move within array of focusable elements (previous or next)
 * @returns {HTMLElement} - element to be focused
 */

function getEntries(query: string) {
  const entries = Array.from(document.querySelectorAll(query));
  const firstElement = entries[0];
  const lastElement = entries[entries.length - 1];

  return { entries, firstElement, lastElement };
}

export function getNextSibling(
  query: string,
  element: EventTarget
): HTMLElement {
  const { entries, firstElement, lastElement } = getEntries(query);
  const elementIndex = entries.indexOf(element as HTMLButtonElement);

  if (element === lastElement) {
    return firstElement as HTMLElement;
  }
  return entries[elementIndex + 1] as HTMLElement;
}

export function getPrevSibling(
  query: string,
  element: EventTarget
): HTMLElement {
  const { entries, firstElement, lastElement } = getEntries(query);
  const elementIndex = entries.indexOf(element as HTMLButtonElement);

  if (element === firstElement) {
    return lastElement as HTMLElement;
  }

  return entries[elementIndex - 1] as HTMLElement;
}

const FocusTrapWrapper = ({
  children,
  id,
  setPopup
}: {
  children: JSX.Element | JSX.Element[];
  id: string;
  setPopup: any;
}): JSX.Element => {
  const queryId = `#${id}-popup-focus-trap button`;
  const handleKeyDown = useCallback(
    e => {
      const element = e.target as HTMLElement;
      switch (e.key) {
        case "Escape":
          setPopup(false);
          break;
        case "Tab":
          if (e.shiftKey) {
            e.preventDefault();
            getPrevSibling(queryId, element)?.focus();
          } else {
            e.preventDefault();
            getNextSibling(queryId, element)?.focus();
          }
          break;
        default:
      }
    },
    [setPopup]
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
