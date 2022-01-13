import React from "react";
import { action } from "@storybook/addon-actions";

import FromToLocationPicker from ".";

import "../__mocks__/trimet-mock.css";

export default {
  title: "From-To-Picker",
  component: FromToLocationPicker
};

const onFromClick = action("onFromClick");
const onToClick = action("onToClick");

export const fromTo = (): React.ReactElement => (
  <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
);

export const smallTextSansSerif = (): React.ReactElement => (
  <span style={{ fontSize: "75%", fontFamily: "sans-serif" }}>
    Plan a trip:
    <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
  </span>
);

export const otpAmbientStyle = (): React.ReactElement => (
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
