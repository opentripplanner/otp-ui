import React, { ReactNode, useCallback } from "react";
import { getNextSibling, getPreviousSibling } from "./dom-query";

const FocusTrapWrapper = ({
  children,
  closePopup = null,
  focusElements = ["button", "a", "input", "select"],
  id
}: {
  children: ReactNode | ReactNode[];
  closePopup?: (arg?: boolean) => void;
  id: string;
  focusElements?: string[];
}): JSX.Element => {
  const queryId = focusElements
    .map(el => `#${id}-focus-trap ${el}:not([disabled])`)
    .join(", ");
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
    <div id={`${id}-focus-trap`} onKeyDown={handleKeyDown} role="presentation">
      {children}
    </div>
  );
};

export { getNextSibling, getPreviousSibling };

export default FocusTrapWrapper;
