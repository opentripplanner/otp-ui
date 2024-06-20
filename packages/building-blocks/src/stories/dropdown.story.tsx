import React from "react";
import { ComponentMeta } from "@storybook/react";
import { Dropdown } from "../dropdown";

const options = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" }
];

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
      <li key={option.value} value={option.value}>
        {option.label}
      </li>
    ))}
  </Dropdown>
);
