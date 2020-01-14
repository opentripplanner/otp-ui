import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import CheckboxSelector from ".";

export default {
  title: "CheckboxSelector",
  component: "CheckboxSelector",
  decorators: [withInfo],
  parameters: {
    info: {
      text: `Checkbox component with label.`
    }
  }
};

const onChange = action("onChange");

export const normal = () => (
  <CheckboxSelector
    name="MyParam"
    style={{ display: "inline-block", width: "250px" }}
    label="Check me."
    onChange={onChange}
  />
);
