import React from "react";
import styled from "styled-components";

export const BaseButton = styled.button`
  border: none;
  background: none;
`;

export const Button = styled(BaseButton)`
  color: #888;
  margin: 0;
  padding: 2px 5px;
`;

export const ClearBoth = styled.div`
  clear: both;
`;

export const DropdownButton = styled(BaseButton)`
  width: 30px;
`;

export const DropdownContainer = styled.span`
  position: contents;
  width: 100%;
`;

type MenuItemListProps = {
  uniqueId: string;
};

export const MenuItemList = styled.ul.attrs((props: MenuItemListProps) => ({
  "aria-label": "Search Results",
  id: props.uniqueId,
  role: "listbox"
}))<MenuItemListProps>`
  background-clip: padding-box;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  float: left;
  font-size: 14px;
  left: 0;
  list-style: none;
  margin: 2px 0 0;
  min-width: 160px;
  padding: 5px 0;
  position: absolute;
  text-align: left;
  top: 100%;
  /* this is an annoyingly high number, but is needed to be on top of some otp-rr components */
  z-index: 1000000;
`;

export const Dropdown = ({
  children,
  listBoxIdentifier,
  locationType,
  onToggle = () => {},
  open,
  title
}: {
  children: React.ReactNode;
  listBoxIdentifier: string;
  locationType: string;
  open: boolean;
  onToggle?: () => void;
  title: React.ReactNode;
}): React.ReactElement => {
  const dropdownButtonAriaLabel = `List the suggested ${locationType} locations as you type`;
  return (
    <DropdownContainer>
      <DropdownButton aria-label={dropdownButtonAriaLabel} onClick={onToggle}>
        {title}
      </DropdownButton>
      {open && (
        <MenuItemList uniqueId={listBoxIdentifier}>{children}</MenuItemList>
      )}
    </DropdownContainer>
  );
};

export const FormGroup = styled.div`
  border-collapse: separate;
  display: table;
  margin-bottom: 15px;
  position: relative;
`;

export const Input = styled.input`
  border: none;
  box-shadow: none;
  font-size: 17px;
  outline: none;
`;

export const InputGroup = styled.span`
  border-bottom: 1px solid #000;
  border-collapse: separate;
  display: table;
  position: relative;
`;

export const InputGroupAddon = styled.span`
  background: none;
  border-radius: 4px;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  padding: 6px 12px;
  text-align: center;
`;

export const MenuItemA = styled.a<{ active?: boolean }>`
  background-color: ${props => (props.active ? "#337ab7" : "transparent")};
  clear: both;
  color: ${props => (props.active ? "#fff" : "#333")};
  display: block;
  font-weight: 400;
  line-height: 1.42857143;
  padding: 3px 20px;
  text-decoration: none;
  white-space: nowrap;
`;

export const MenuItemHeader = styled.li<{
  bgColor?: string;
  centeredText?: boolean;
  fgColor?: string;
}>`
  color: ${props => props.fgColor || "#eee"};
  background-color: ${props => props.bgColor || "#333"};
  display: block;
  font-size: 12px;
  line-height: 1.42857143;
  padding: 0px 10px;
  text-align: ${props => (props.centeredText ? "center" : "left")};
  white-space: nowrap;
`;
export const MenuItemLi = styled.li<{ disabled?: boolean }>`
  &:hover {
    cursor: pointer;
    /* TODO: adjust highlight color based on props.color? */
    background-color: ${props => !props.disabled && "#f5f5f5"};
  }
`;

export const MenuItem = ({
  active = false,
  centeredText = false,
  children,
  // foregroundColor and backgroundColor would be preferred, but React has issues with
  // these since they are style keywords
  bgColor = null,
  disabled = false,
  fgColor = null,
  header = false,
  onClick = null
}: {
  active?: boolean;
  centeredText?: boolean;
  children: React.ReactNode;
  fgColor?: string;
  bgColor?: string;
  disabled?: boolean;
  header?: boolean;
  onClick?: () => void;
}): React.ReactElement => {
  const handleClick = () => {
    if (!disabled) onClick();
  };

  return header ? (
    <MenuItemHeader
      className="header"
      fgColor={fgColor}
      bgColor={bgColor}
      centeredText={centeredText}
      role="none"
    >
      {children}
    </MenuItemHeader>
  ) : (
    <MenuItemLi disabled={disabled} role="none">
      <MenuItemA
        active={active}
        aria-disabled={disabled}
        onClick={handleClick}
        role="option"
        tabIndex={-1}
      >
        {children}
      </MenuItemA>
    </MenuItemLi>
  );
};

export const OptionContainer = styled.div`
  padding-top: 5px;
  padding-bottom: 3px;
`;

export const OptionSubTitle = styled.span`
  color: #686868;
  font-size: 12px;
  margin-left: 6px;
`;

export const OptionContent = styled.div`
  margin-left: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OptionIconContainer = styled.div`
  float: left;
`;

export const RouteName = styled.span`
  background-color: gray;
  color: white;
  padding: 2px 3px 0px;
  margin-right: 5px;
`;

export const StaticMenuItemList = styled(MenuItemList)`
  border: none;
  box-shadow: none;
  display: block;
  position: static;

  li:not(.header):hover {
    background-color: transparent;
  }
`;

export const StopContentContainer = styled.div`
  margin-left: 30px;
`;

export const StopDistance = styled.div`
  font-size: 8px;
`;

export const StopIconAndDistanceContainer = styled.div`
  float: left;
  padding-top: 3px;
`;

export const StopName = styled.div``;

export const StopRoutes = styled.div`
  font-size: 9px;
`;

export const HiddenContent = styled.span`
  clip: rect(0, 0, 0, 0);
  display: block;
  height: 0;
  overflow: hidden;
  width: 0;
`;
