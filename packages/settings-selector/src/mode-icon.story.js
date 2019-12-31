import React from "react";
import { withKnobs, object } from "@storybook/addon-knobs";
import { withInfo } from "@storybook/addon-info";

import ModeIcon from "./mode-icon";

export default {
  title: "ModeIcon",
  decorators: [withInfo, withKnobs],
  parameters: {
    info: {
      text:
        "A generic icon component that displays an icon for the specified transportation mode."
    }
  }
};

const mode = "BICYCLE";

export const modeIcon = () => <ModeIcon mode={object("mode", mode)} />;
