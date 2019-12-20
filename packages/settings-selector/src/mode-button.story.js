import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import * as Icons from "@opentripplanner/icons";

import ModeButton from "./mode-button";

const background = story => (
  <div
    style={{
      backgroundColor: "#F0F0F0",
      height: "200px",
      padding: "15px"
    }}
  >
    {story()}
  </div>
);

export default {
  title: "Mode Button",
  component: "ModeButton",
  decorators: [withInfo, background],
  parameters: {
    info: {
      text: `
      ModeButton lets the user pick a travel mode.
      It includes the actual button that supports HTML/React text and graphics,
      and a title displayed when hovering the mouse over the button, and, optionally, underneath it.
      A ModeButton can be enabled or disabled, and active or inactive.   
      `
    }
  }
};

const onClick = action("onClick");

export const normal = () => (
  <ModeButton onClick={onClick} title="Normal">
    <Icons.Max />
    +
    <Icons.Bike />
    Go by train or bike
  </ModeButton>
);

export const active = () => (
  <ModeButton
    selected
    onClick={onClick}
    title="Active modes are shown this way."
  >
    <Icons.Max />
    Train
  </ModeButton>
);

export const disabled = () => (
  <ModeButton
    enabled={false}
    label="Can't Select!"
    onClick={onClick}
    title="Disabled"
  >
    <Icons.AlertSolid />
    Can&apos;t select!
    <Icons.Alert />
  </ModeButton>
);

export const labelOnly = () => (
  <ModeButton onClick={onClick} showTitle={false} title="Walk Only">
    <Icons.Max />
    Walk Only
  </ModeButton>
);
