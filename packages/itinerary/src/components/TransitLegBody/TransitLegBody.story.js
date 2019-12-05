import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import TransitLegBody from ".";
import itinerary from "../../__mocks__/itinerary";
import ThemeShim from "../../common/components/ThemeShim";
import MainStyleDecorator from "../../common/components/MainStyleDecorator";
import { LIGHT_THEME, DARK_THEME } from "../../common/constants";

const setActiveLeg = action("setActiveLeg");
const leg = itinerary.legs[1];
const legIndex = 1;
// Originally from OTP MOD config
const longDateFormat = "MMMM D, YYYY";
// Originally from OTP MOD config
const operator = {
  id: "TRIMET",
  name: "TriMet",
  logo:
    "http://news.trimet.org/wordpress/wp-content/uploads/2019/04/TriMet-logo-300x300.png"
};
// Originally from OTP MOD config
const timeFormat = "h:mm a";

storiesOf("Itinerary|Transit Leg Body", module)
  // .addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]))
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(MainStyleDecorator)
  .add("Transit Leg Body", () => (
    <ThemeShim>
      <TransitLegBody
        leg={leg}
        legIndex={legIndex}
        setActiveLeg={setActiveLeg}
        longDateFormat={longDateFormat}
        operator={operator}
        timeFormat={timeFormat}
      />
    </ThemeShim>
  ));
