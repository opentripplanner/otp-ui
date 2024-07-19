import React from "react";
import { ComponentMeta } from "@storybook/react";
import styled from "styled-components";
import Dropdown from "../dropdown";
import blue from "../colors/blue";

const options = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" }
];

const NavItemWrapper = styled.div`
  align-items: center;
  background: ${blue[900]};
  display: flex;
  min-height: 50px;
  padding: 0 10px;
  position: relative;
  width: 100%;

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
    text="Dropdown with label"
  >
    More content here
  </Dropdown>
);

export const DropdownWithList = (): React.ReactElement => (
  <Dropdown
    id="dropdown-with-ul"
    label="Dropdown with ul"
    listLabel="Dropdown menu"
    text="Dropdown with ul"
  >
    {options.map(option => (
      <li key={option.value} value={option.value}>
        <button type="button">{option.label}</button>
      </li>
    ))}
  </Dropdown>
);

export const DropdownWithListAlignMenuLeft = (): React.ReactElement => (
  <Dropdown
    alignMenuLeft
    id="dropdown-with-ul"
    label="Dropdown with ul"
    listLabel="Dropdown menu"
    text="Dropdown with ul"
  >
    {options.map(option => (
      <li key={option.value} value={option.value}>
        <button type="button">{option.label}</button>
      </li>
    ))}
  </Dropdown>
);

export const DropdownAsOtprrNavItem = (): React.ReactElement => (
  <NavItemWrapper>
    <Dropdown
      className="navBarItem"
      id="dropdown-navbar"
      label="Dropdown navbar"
      listLabel="Dropdown within navbar"
      text="Icon"
    >
      {options.map(option => (
        <button key={option.value} type="button">
          {option.label}
        </button>
      ))}
    </Dropdown>
  </NavItemWrapper>
);
