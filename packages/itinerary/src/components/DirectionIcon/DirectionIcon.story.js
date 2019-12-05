/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
// import { withThemesProvider } from "storybook-addon-styled-component-theme";
import MainStyleDecorator from "../../common/components/MainStyleDecorator";
// import {
//   LIGHT_THEME,
//   DARK_THEME
// } from "../../common/constants";
import ThemeShim from "../../common/components/ThemeShim";
import DirectionIcon from ".";

storiesOf("Itinerary|DirectionIcon", module)
  // .addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]))
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(MainStyleDecorator)
  .add("Depart", () => (
    <ThemeShim>
      <DirectionIcon direction="depart" />
    </ThemeShim>
  ))
  .add("Continue", () => (
    <ThemeShim>
      <DirectionIcon direction="continue" />
    </ThemeShim>
  ))
  .add("Left", () => (
    <ThemeShim>
      <DirectionIcon direction="left" />
    </ThemeShim>
  ))
  .add("Right", () => (
    <ThemeShim>
      <DirectionIcon direction="right" />
    </ThemeShim>
  ))
  .add("SlightlyLeft", () => (
    <ThemeShim>
      <DirectionIcon direction="slightlyleft" />
    </ThemeShim>
  ))
  .add("SlightlyRight", () => (
    <ThemeShim>
      <DirectionIcon direction="slightlyright" />
    </ThemeShim>
  ))
  .add("HardLeft", () => (
    <ThemeShim>
      <DirectionIcon direction="hardleft" />
    </ThemeShim>
  ))
  .add("HardRight", () => (
    <ThemeShim>
      <DirectionIcon direction="hardright" />
    </ThemeShim>
  ))
  .add("UTurnLeft", () => (
    <ThemeShim>
      <DirectionIcon direction="uturnleft" />
    </ThemeShim>
  ))
  .add("UTurnRight", () => (
    <ThemeShim>
      <DirectionIcon direction="uturnright" />
    </ThemeShim>
  ))
  .add("CircleClockwise", () => (
    <ThemeShim>
      <DirectionIcon direction="circleclockwise" />
    </ThemeShim>
  ))
  .add("CircleCounterClockwise", () => (
    <ThemeShim>
      <DirectionIcon direction="circlecounterclockwise" />
    </ThemeShim>
  ))
  .add("Elevator", () => (
    <ThemeShim>
      <DirectionIcon direction="elevator" />
    </ThemeShim>
  ));
