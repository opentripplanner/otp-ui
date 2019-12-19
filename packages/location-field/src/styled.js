import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const BaseButton = styled.button`
  border: none;
  background: none;
`;

export const Button = styled(BaseButton)`
  color: #888;
  margin: 0;
  padding: 2px 5px;
`;

export const Dropdown = ({ children, open, onToggle, title }) => {
  return (
    <DropdownContainer>
      <DropdownButton onClick={onToggle}>{title}</DropdownButton>
      {open && <MenuItemList>{children}</MenuItemList>}
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func,
  title: PropTypes.node.isRequired
};

Dropdown.defaultProps = {
  onToggle: () => {}
};

const DropdownButton = styled(BaseButton)`
  width: 30px;
`;

const DropdownContainer = styled.span`
  position: relative;
`;

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

export const MenuItem = ({
  active,
  centeredText,
  children,
  header,
  onClick
}) => {
  return header ? (
    <MenuItemHeader centeredText={centeredText}>{children}</MenuItemHeader>
  ) : (
    <MenuItemLi role="presentation">
      <MenuItemA
        active={active}
        onClick={onClick}
        role="menuitem"
        tabIndex={-1}
      >
        {children}
      </MenuItemA>
    </MenuItemLi>
  );
};

MenuItem.propTypes = {
  active: PropTypes.bool,
  centeredText: PropTypes.bool,
  children: PropTypes.node.isRequired,
  header: PropTypes.bool,
  onClick: PropTypes.func
};

MenuItem.defaultProps = {
  active: false,
  centeredText: false,
  header: false,
  onClick: null
};

const MenuItemA = styled.a`
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

const MenuItemHeader = styled.li`
  color: navy;
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.42857143;
  padding: 3px 20px;
  text-align: ${props => (props.centeredText ? "center" : "left")};
  white-space: nowrap;
`;

const MenuItemLi = styled.li`
  &:hover {
    background-color: #f5f5f5;
  }
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
  z-index: 1000;
`;

export const OptionContainer = styled.div`
  padding-top: 5px;
  padding-bottom: 3px;
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

  li:hover {
    background-color: transparent;
  }
`;
