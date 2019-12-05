import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import AccessLegBody from ".";
import itinerary from "../../__mocks__/itinerary";
import ThemeShim from "../../common/components/ThemeShim";
import MainStyleDecorator from "../../common/components/MainStyleDecorator";
import {
  LIGHT_THEME,
  DARK_THEME
} from "../../common/constants";
import config from "../../__mocks__/config";

const customIcons = [];
const followsTransit = false;
const leg = itinerary.legs[0];
const timeOptions = { format: "h:mm a" };
const legIndex = 0;
const routingType = "ITINERARY";
const setActiveLeg = action("setActiveLeg");

storiesOf("Itinerary|Access Leg Body", module)
  // .addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]))
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(MainStyleDecorator)
  .add("Access Leg Body", () => (
    <ThemeShim>
      <AccessLegBody
        config={config}
        leg={leg}
        customIcons={customIcons}
        legIndex={legIndex}
        timeOptions={timeOptions}
        followsTransit={followsTransit}
        setActiveLeg={setActiveLeg}
        routingType={routingType}
      />
    </ThemeShim>
  ));
