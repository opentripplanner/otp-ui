import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import FromToLocationPicker from ".";

import "../mocks/trimet-mock.css";

export default {
  title: "From-To-Picker",
  decorators: [withInfo]
};

const onFromClick = action("onFromClick");
const onToClick = action("onToClick");

export const fromTo = () => (
  <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
);

export const smallTextSansSerif = () => (
  <span style={{ "font-size": "75%", "font-family": "sans-serif" }}>
    Plan a trip:
    <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
  </span>
);

export const otpAmbientStyle = () => (
  <div className="trimet-ambient">
    <FromToLocationPicker
      fromText="Start here"
      toText="Go here"
      showIcons={false}
      onFromClick={onFromClick}
      onToClick={onToClick}
    />
  </div>
);
