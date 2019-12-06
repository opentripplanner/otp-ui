import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const BaseButton = styled.button`
  border: none;
  background: none;
`;

const Button = styled(BaseButton)`
  color: #888;
  margin: 0;
  padding: 2px 5px;
`;

const Dropdown = ({ children, open, onToggle, title }) => {
  return (
    <DropdownContainer>
      <DropdownButton onClick={onToggle}>{title}</DropdownButton>
      {open && <DropdownList>{children}</DropdownList>}
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

const DropdownList = styled.ul`
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

const FormGroup = styled.div`
  border-collapse: separate;
  display: table;
  margin-bottom: 15px;
  position: relative;
`;

const Input = styled.input`
  border: none;
  box-shadow: none;
  font-size: 17px;
  outline: none;
`;

const InputGroup = styled.span`
  border-bottom: 1px solid #000;
  border-collapse: separate;
  display: table;
  font-family: system-ui;
  position: relative;
`;

const InputGroupAddon = styled.span`
  border: none;
  background: none;
  color: #888;
  cursor: pointer;
`;

const MenuItem = ({ active, centeredText, children, header, onClick }) => {
  return header ? (
    <MenuItemHeader centeredText={centeredText}>children</MenuItemHeader>
  ) : (
    <li>
      <MenuItemA active={active} onClick={onClick}>
        {children}
      </MenuItemA>
    </li>
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

export {
  Button,
  Dropdown,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  MenuItem
};
