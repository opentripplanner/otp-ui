import React from "react";
import { withKnobs, object } from "@storybook/addon-knobs";
import { withInfo } from "@storybook/addon-info";

import ModeIconWrap from "./styled";
import ModeIcon from ".";

const background = story => <ModeIconWrap>{story()}</ModeIconWrap>;

export default {
  title: "ModeIcon",
  decorators: [withInfo, withKnobs, background],
  parameters: {
    info: {
      text:
        "A generic icon component that displays an icon for the specified transportation mode."
    }
  }
};

const mode = "BICYCLE";

export const modeIcon = () => <ModeIcon mode={object("mode", mode)} />;
