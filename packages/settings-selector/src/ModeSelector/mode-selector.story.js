import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import ModeSelector from ".";
import modeOptions from "../__mocks__/mode-options";

const onChange = action("onChange");

export default {
  title: "ModeSelector",
  decorators: [withInfo],
  parameters: {
    info: {
      text: `
      ModeSelector is the control container where the OTP user selects
      the primary transportation modes such as transit, bike, walk, or micromobility.
     `
    }
  }
};

export const normal = () => (
  <ModeSelector modes={modeOptions} onChange={onChange} />
);
