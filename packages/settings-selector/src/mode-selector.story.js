import React from "react";
import { withInfo } from "@storybook/addon-info";

import ModeSelector from "./mode-selector";

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

export const normal = () => <ModeSelector selectedModes={selectedModes} />;
