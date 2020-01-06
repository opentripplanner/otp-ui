import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import DropdownSelector from ".";

export default {
  title: "DropdownSelector",
  component: "DropdownSelector",
  decorators: [withInfo],
  parameters: {
    info: {
      text: `Dropdown component with label.`
    }
  }
};

const onChange = action("onChange");

const options = [
  {
    text: "Option 1",
    value: "Value1"
  },
  {
    text: "Option 2",
    value: "Value2"
  }
];

export const normal = () => (
  <DropdownSelector
    name="MyParam"
    style={{ display: "inline-block", width: "250px" }}
    label="Pick an option:"
    options={options}
    onChange={onChange}
  />
);
