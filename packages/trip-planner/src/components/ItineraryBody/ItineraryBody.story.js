import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import ItineraryBody from ".";
import itinerary from "../../__mocks__/itinerary";
import ThemeShim from "~/packages/trip-planner/src/common/components/ThemeShim";
import MainStyleDecorator from "~/packages/trip-planner/src/common/components/MainStyleDecorator";
import {
  LIGHT_THEME,
  DARK_THEME
} from "~/packages/trip-planner/src/common/constants";
import config from "../../__mocks__/config";

const setActiveLeg = action("setActiveLeg");
const companies = "";
const timeOptions = { format: "h:mm a" };
const routingType = "ITINERARY";
const customIcons = [];

const frameLeg = action("frameLeg");
const toRouteAbbreviation = r => r.toString();

storiesOf("Itinerary|Itinerary Body", module)
  // .addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]))
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(MainStyleDecorator)
  .add("Itinerary Body", () => (
    <ThemeShim>
      <ItineraryBody
        itinerary={itinerary}
        setActiveLeg={setActiveLeg}
        timeOptions={timeOptions}
        companies={companies}
        routingType={routingType}
        frameLeg={frameLeg}
        toRouteAbbreviation={toRouteAbbreviation}
        config={config}
        customIcons={customIcons}
      />
    </ThemeShim>
  ));
