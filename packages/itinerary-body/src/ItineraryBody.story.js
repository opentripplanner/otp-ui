import TriMetLegIcon from "@opentripplanner/icons/lib/trimet-leg-icon";
import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";

import ItineraryBody from ".";

const config = require("./__mocks__/config.json");

// import mock itinaries. These are all trip plan outputs from OTP.
const walkOnlyItinerary = require("./__mocks__/intineraries/walk-only.json");
const walkTransitWalkItinerary = require("./__mocks__/intineraries/walk-transit-walk.json");

const setViewedTrip = action("setViewedTrip");
const toRouteAbbreviation = r => r.toString().substr(0, 2);

storiesOf("ItineraryBody", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ItineraryBody with walk-only itinerary", () => (
    <ItineraryBody
      config={config}
      itinerary={walkOnlyItinerary}
      LegIcon={TriMetLegIcon}
      setViewedTrip={setViewedTrip}
      toRouteAbbreviation={toRouteAbbreviation}
    />
  ))
  .add("ItineraryBody with transit itinerary", () => (
    <ItineraryBody
      config={config}
      itinerary={walkTransitWalkItinerary}
      LegIcon={TriMetLegIcon}
      setViewedTrip={setViewedTrip}
      toRouteAbbreviation={toRouteAbbreviation}
    />
  ));
