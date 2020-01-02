import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import SubmodeSelector from "./submode-selector";
import submodeOptions from "./__mocks__/submode-options";

const onChange = action("onChange");

export default {
  title: "SubmodeSelector",
  decorators: [withInfo],
  parameters: {
    info: {
      text: `
      SubmodeSelector is the control container where the OTP user selects
      the submodes (e.g. train, bus) for transit, or the providers for rental companies.
     `
    }
  }
};

export const normal = () => (
  <SubmodeSelector modes={submodeOptions} onChange={onChange} />
);
