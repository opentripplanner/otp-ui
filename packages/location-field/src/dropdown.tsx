import React, { FocusEventHandler } from "react";
import { useIntl } from "react-intl";

import * as S from "./styled";

export const Dropdown = ({
  children,
  className,
  input,
  listBoxIdentifier,
  onBlur,
  onToggle = () => {},
  open,
  status,
  title
}: {
  children: React.ReactNode;
  className: string;
  input?: JSX.Element;
  listBoxIdentifier: string;
  onBlur?: FocusEventHandler;
  onToggle?: () => void;
  open: boolean;
  status: string;
  title: React.ReactNode;
}): React.ReactElement => {
  const intl = useIntl();

  return (
    <S.InputGroup className={className} onBlur={onBlur} role="group">
      <S.DropdownButton
        aria-controls={listBoxIdentifier}
        aria-expanded={open}
        aria-label={intl.formatMessage({
          defaultMessage: "Open the list of location suggestions",
          description:
            "Text to show as a a11y label for the button that opens the dropdown list of locations",
          id: "otpUi.LocationField.suggestedLocationsLong"
        })}
        onClick={onToggle}
        tabIndex={-1}
      >
        {title}
      </S.DropdownButton>
      {input}
      {/* Note: always render this status tag regardless of the open state,
          so that assistive technologies correctly set up status monitoring. */}
      <S.HiddenContent role="status">{status}</S.HiddenContent>
      {open && (
        <S.MenuItemList
          aria-label={intl.formatMessage({
            defaultMessage: "Suggested locations",
            description:
              "Text to show as a label for the dropdown list of locations",
            id: "otpUi.LocationField.suggestedLocations"
          })}
          id={listBoxIdentifier}
        >
          {children}
        </S.MenuItemList>
      )}
    </S.InputGroup>
  );
};

export default Dropdown;
