import React, { ReactElement } from "react";
import ColorPalette from "./ColorPalette";

import grey from "../colors/grey";
import blue from "../colors/blue";
import red from "../colors/red";

export default {
  title: "Building-Blocks/Colors"
};

export const Grey = (): ReactElement => {
  return <ColorPalette color={grey} />;
};

export const Blue = (): ReactElement => {
  return <ColorPalette color={blue} />;
};

export const Red = (): ReactElement => {
  return <ColorPalette color={red} />;
};
