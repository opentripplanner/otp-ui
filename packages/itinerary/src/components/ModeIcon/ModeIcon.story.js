/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import MainStyleDecorator from "~/packages/trip-planner/src/common/components/MainStyleDecorator";
import {
  LIGHT_THEME,
  DARK_THEME
} from "~/packages/trip-planner/src/common/constants";
import ThemeShim from "~/packages/trip-planner/src/common/components/ThemeShim";
import ModeIcon from ".";

storiesOf("Itinerary|ModeIcon", module)
  // .addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]))
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(MainStyleDecorator)
  .add("Tram", () => (
    <ThemeShim>
      <ModeIcon mode="tram" />
    </ThemeShim>
  ))
  .add("Rail", () => (
    <ThemeShim>
      <ModeIcon mode="rail" />
    </ThemeShim>
  ))
  .add("Subway", () => (
    <ThemeShim>
      <ModeIcon mode="subway" />
    </ThemeShim>
  ))
  .add("Walk", () => (
    <ThemeShim>
      <ModeIcon mode="walk" />
    </ThemeShim>
  ))
  .add("Bicycle", () => (
    <ThemeShim>
      <ModeIcon mode="bicycle" />
    </ThemeShim>
  ))
  .add("Bicycle - Rental", () => (
    <ThemeShim>
      <ModeIcon mode="bicycle_rent" />
    </ThemeShim>
  ))
  .add("Ferry", () => (
    <ThemeShim>
      <ModeIcon mode="ferry" />
    </ThemeShim>
  ))
  .add("Gondola/Aerial Tram", () => (
    <ThemeShim>
      <ModeIcon mode="gondola" />
    </ThemeShim>
  ))
  .add("Car", () => (
    <ThemeShim>
      <ModeIcon mode="car" />
    </ThemeShim>
  ))
  .add("Micromobility", () => (
    <ThemeShim>
      <ModeIcon mode="micromobility" />
    </ThemeShim>
  ))
  .add("Micromobility - Rental", () => (
    <ThemeShim>
      <ModeIcon mode="micromobility_rent" />
    </ThemeShim>
  ));
