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
import DirectionIcon from ".";

storiesOf("Itinerary|DirectionIcon", module)
  // .addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]))
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(MainStyleDecorator)
  .add('Depart', () => (<DirectionIcon direction='depart' />))
  .add('Continue', () => (<DirectionIcon direction='continue' />))
  .add('Left', () => (<DirectionIcon direction='left' />))
  .add('Right', () => (<DirectionIcon direction='right' />))
  .add('SlightlyLeft', () => (<DirectionIcon direction='slightlyleft' />))
  .add('SlightlyRight', () => (<DirectionIcon direction='slightlyright' />))
  .add('HardLeft', () => (<DirectionIcon direction='hardleft' />))
  .add('HardRight', () => (<DirectionIcon direction='hardright' />))
  .add('UTurnLeft', () => (<DirectionIcon direction='uturnleft' />))
  .add('UTurnRight', () => (<DirectionIcon direction='uturnright' />))
  .add('CircleClockwise', () => (<DirectionIcon direction='circleclockwise' />))
  .add('CircleCounterClockwise', () => (<DirectionIcon direction='circlecounterclockwise' />))
  .add('Elevator', () => (<DirectionIcon direction='elevator' />))
