import React from "react";
import { action } from "@storybook/addon-actions";

import FromToLocationPicker from ".";

export default { title: "From-To-Picker" };

const onFromClick = action("onFromClick");
const onToClick = action("onToClick");

export const fromTo = () => (
  <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
);
export const smallTextSansSerif = () => (
  <span style={{ "font-size": "75%", "font-family": "sans-serif" }}>
    <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
  </span>
);
