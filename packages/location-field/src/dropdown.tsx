import React, { FocusEventHandler } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import * as S from "./styled";

export const Dropdown = ({
  className,
  input,
  isStatic,
  listBoxIdentifier,
  menuItems,
  onBlur,
  onToggle = () => {},
  open,
  status,
  title
}: {
  className: string;
  input?: JSX.Element;
  isStatic?: boolean;
  listBoxIdentifier: string;
  menuItems: React.ReactNode[];
  onBlur?: FocusEventHandler;
  onToggle?: () => void;
  open?: boolean;
  status: string;
  title: React.ReactNode;
}): React.ReactElement => {
  const intl = useIntl();
  const ItemList = isStatic ? S.StaticMenuItemList : S.MenuItemList;

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
      {/* Note: always render the suggestion list because it is
          being referenced through aria-controls of the dropdown button. */}
      <ItemList
        aria-label={intl.formatMessage({
          defaultMessage: "Suggested locations",
          description:
            "Text to show as a label for the dropdown list of locations",
          id: "otpUi.LocationField.suggestedLocations"
        })}
        id={listBoxIdentifier}
      >
        {isStatic ? (
          menuItems.length > 0 ? ( // Show typing prompt to avoid empty screen
            menuItems
          ) : (
            <S.MenuGroupMisc role="none">
              <FormattedMessage
                description="Text to show as initial placeholder in location search field"
                id="otpUi.LocationField.beginTypingPrompt"
              />
            </S.MenuGroupMisc>
          )
        ) : (
          open && menuItems
        )}
      </ItemList>
    </S.InputGroup>
  );
};

export default Dropdown;
