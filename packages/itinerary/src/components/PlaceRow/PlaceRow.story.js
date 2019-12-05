import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import { action } from "@storybook/addon-actions";
import PlaceRow from ".";
import MainStyleDecorator from "../../common/components/MainStyleDecorator";
import {
  LIGHT_THEME,
  DARK_THEME
} from "../../common/constants";
import ThemeShim from "../../common/components/ThemeShim";
import itinerary from "../../__mocks__/itinerary";
import config from "../../__mocks__/config";

const accessLegIndex = 0;
const transitLegIndex = 1;
const accessLeg = itinerary.legs[accessLegIndex];
const transitLeg = itinerary.legs[transitLegIndex];
const customIcons = [];
// const place = itinerary.legs[0].from;
// const time = itinerary.legs[0].startTime;
const timeOptions = { format: "h:mm a" };
const followsTransit = false;
const routingType = "ITINERARY";

// Originally from OTP MOD config
const longDateFormat = "MMMM D, YYYY";
// Originally from OTP MOD config
const timeFormat = "h:mm a";

const setActiveLeg = action("setActiveLeg");
const frameLeg = action("frameLeg");
const toRouteAbbreviation = r => r.toString();

storiesOf("Itinerary|PlaceRow", module)
  // .addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]))
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(MainStyleDecorator)
  .add("Place Row with Access Leg", () => (
    <ThemeShim>
      <PlaceRow
        leg={accessLeg}
        legIndex={accessLegIndex}
        place={accessLeg.from}
        time={accessLeg.startTime}
        config={config}
        customIcons={customIcons}
        timeOptions={timeOptions}
        followsTransit={followsTransit}
        routingType={routingType}
        setActiveLeg={setActiveLeg}
        frameLeg={frameLeg}
        toRouteAbbreviation={toRouteAbbreviation}
      />
    </ThemeShim>
  ))
  .add("Place Row with Transit Leg", () => (
    <ThemeShim>
      <PlaceRow
        leg={transitLeg}
        legIndex={transitLegIndex}
        place={transitLeg.from}
        time={transitLeg.startTime}
        config={config}
        customIcons={customIcons}
        timeOptions={timeOptions}
        followsTransit={followsTransit}
        routingType={routingType}
        setActiveLeg={setActiveLeg}
        frameLeg={frameLeg}
        longDateFormat={longDateFormat}
        timeFormat={timeFormat}
        toRouteAbbreviation={toRouteAbbreviation}
      />
    </ThemeShim>
  ));
