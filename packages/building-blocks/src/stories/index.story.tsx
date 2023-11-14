import React, { ReactElement } from "react";
import ColorPalette from "./color-stories/ColorPalette";

import grey from "../colors/grey";
import blue from "../colors/blue";
import red from "../colors/red";

export default {
  title: "Building-Blocks/Colors"
};

export const Grey = (): ReactElement => {
  return <ColorPalette color={grey} label="Grey" />;
};

export const Blue = (): ReactElement => {
  return <ColorPalette color={blue} label="Blue" />;
};

export const Red = (): ReactElement => {
  return <ColorPalette color={red} label="Red" />;
};
