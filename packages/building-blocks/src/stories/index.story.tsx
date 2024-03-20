import React, { ReactElement } from "react";
import { Meta } from "@storybook/react";
import ColorPalette from "./ColorPalette";

import grey from "../colors/grey";
import blue from "../colors/blue";
import red from "../colors/red";

const meta: Meta<typeof ColorPalette> = {
  title: "Building-Blocks/Colors",
  component: ColorPalette
};

export default meta;

export const Grey = (): ReactElement => {
  return <ColorPalette color={grey} />;
};

export const Blue = (): ReactElement => {
  return <ColorPalette color={blue} />;
};

export const Red = (): ReactElement => {
  return <ColorPalette color={red} />;
};
