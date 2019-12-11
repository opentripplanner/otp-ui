import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import TripDetails from ".";
import itinerary from "../../__mocks__/itinerary";
import ThemeShim from "../../common/components/ThemeShim";
import MainStyleDecorator from "../../common/components/MainStyleDecorator";
import { LIGHT_THEME, DARK_THEME } from "../../common/constants";

storiesOf("Itinerary|Trip Details", module)
  // .addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]))
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(MainStyleDecorator)
  .add("Trip Details", () => (
    <ThemeShim>
      <TripDetails
        tnc={null}
        itinerary={itinerary}
      />
    </ThemeShim>
  ));
