import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import ModeSelector, { getModeOptions } from "./mode-selector";
import { commonModes } from "./modes";

const background = story => (
  <div
    style={{
      backgroundColor: "#F0F0F0",
      height: "200px",
      padding: "15px",
      fontFamily: "Hind, sans-serif"
    }}
  >
    {story()}
  </div>
);

const selectedModes = ["BICYCLE", "TRAM", "RAIL", "BUS"];

const modeOptions = getModeOptions(commonModes, selectedModes);

const onChange = action("onChange");

export default {
  title: "Mode Selector",
  decorators: [withInfo, background],
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
