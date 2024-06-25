import React from "react";
import { ComponentMeta } from "@storybook/react";
import styled from "styled-components";
import { Dropdown } from "../dropdown";
import blue from "../colors/blue";

const options = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" }
];

const NavItemWrapper = styled.div`
  background: ${blue[900]};
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 50px;
  padding: 0 10px;
  position: relative;

  .navBarItem {
    position: static;
    & > button {
      background: transparent;
      border: none;
      color: white;
      padding: 15px;

      @media (max-width: 768px) {
        padding: 10px;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #ececec;
      }
    }
  }
`;

export default {
  title: "Building-Blocks/Dropdown",
  component: Dropdown
} as ComponentMeta<typeof Dropdown>;

export const DropdownWithLabel = (): React.ReactElement => (
  <Dropdown
    id="dropdown-with-label"
    label="Dropdown with label"
    listLabel="Dropdown menu"
    name="Dropdown with label"
    style={{ display: "block ruby" }}
  >
    {options.map(option => (
      <button key={option.value} type="button">
        {option.label}
      </button>
    ))}
  </Dropdown>
);

export const DropdownWithList = (): React.ReactElement => (
  <Dropdown
    id="dropdown-with-ul"
    isList
    label="Dropdown with ul"
    listLabel="Dropdown menu"
    name="Dropdown with ul"
    style={{ display: "block ruby" }}
  >
    {options.map(option => (
      <li key={option.value} value={option.value}>
        {option.label}
      </li>
    ))}
  </Dropdown>
);

export const DropdownAsOtprrNavItem = (): React.ReactElement => (
  <NavItemWrapper>
    <Dropdown
      className="navBarItem"
      id="dropdown-navbar"
      isList
      label="Dropdown navbar"
      listLabel="Dropdown wihtin navbar"
      name="Icon"
      style={{ display: "block ruby" }}
    >
      {options.map(option => (
        <button key={option.value} type="button">
          {option.label}
        </button>
      ))}
    </Dropdown>
  </NavItemWrapper>
);
