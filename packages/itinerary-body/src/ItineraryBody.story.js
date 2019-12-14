import TriMetLegIcon from "@opentripplanner/icons/lib/trimet-leg-icon";
import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
// import { action } from "@storybook/addon-actions";

import ItineraryBody from ".";

const config = require("./__mocks__/config.json");

// import mock itinaries. These are all trip plan outputs from OTP.
const walkOnly = require("./__mocks__/intineraries/walk-only.json");

storiesOf("ItineraryBody", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ItineraryBody with walk-only itinerary", () => (
    <ItineraryBody
      config={config}
      itinerary={walkOnly}
      LegIcon={TriMetLegIcon}
    />
  ));
