import PropTypes from "prop-types";
import React, { Component } from "react";
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

export const MenuItemList = styled.ul`
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

export const Dropdown = ({ children, locationType, open, onToggle, title }) => {
  const dropdownButtonAriaLabel = `List the suggested ${locationType} locations as you type`;
  return (
    <DropdownContainer>
      <DropdownButton aria-label={dropdownButtonAriaLabel} onClick={onToggle}>
        {title}
      </DropdownButton>
      {open && <MenuItemList>{children}</MenuItemList>}
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  locationType: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func,
  title: PropTypes.node.isRequired
};

Dropdown.defaultProps = {
  onToggle: () => {}
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

export const MenuItemA = styled.a`
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

export const MenuItemHeader = styled.li`
  color: ${props => props.fgColor || "#eee"};
  background-color: ${props => props.bgColor || "#333"};
  display: block;
  font-size: 12px;
  line-height: 1.42857143;
  padding: 0px 10px;
  text-align: ${props => (props.centeredText ? "center" : "left")};
  white-space: nowrap;
`;
export const MenuItemLi = styled.li`
  &:hover {
    cursor: pointer;
    /* TODO: adjust highlight color based on props.color? */
    background-color: ${props => !props.disabled && "#f5f5f5"};
  }
`;

export class MenuItem extends Component {
  onClick = () => {
    const { disabled, onClick } = this.props;
    if (!disabled) onClick();
  };

  render() {
    const {
      active,
      centeredText,
      children,
      // foregroundColor and backgroundColor would be preferred, but React has issues with
      // these since they are style keywords
      fgColor,
      bgColor,
      disabled,
      header
    } = this.props;
    return header ? (
      <MenuItemHeader
        className="header"
        fgColor={fgColor}
        bgColor={bgColor}
        centeredText={centeredText}
      >
        {children}
      </MenuItemHeader>
    ) : (
      <MenuItemLi disabled={disabled} role="listitem">
        <MenuItemA
          active={active}
          onClick={this.onClick}
          role="listitem"
          tabIndex={-1}
        >
          {children}
        </MenuItemA>
      </MenuItemLi>
    );
  }
}

MenuItem.propTypes = {
  active: PropTypes.bool,
  centeredText: PropTypes.bool,
  children: PropTypes.node.isRequired,
  fgColor: PropTypes.string,
  bgColor: PropTypes.string,
  disabled: PropTypes.bool,
  header: PropTypes.bool,
  onClick: PropTypes.func
};

MenuItem.defaultProps = {
  active: false,
  centeredText: false,
  fgColor: null,
  bgColor: null,
  disabled: false,
  header: false,
  onClick: null
};

export const OptionContainer = styled.div`
  padding-top: 5px;
  padding-bottom: 3px;
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
