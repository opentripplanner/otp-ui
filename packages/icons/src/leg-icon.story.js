import { object, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";

import * as Icons from ".";

function Container({ children }) {
  return <div style={{ width: 40 }}>{children}</div>;
}

const allStories = storiesOf("Leg Icons", module).addDecorator(withKnobs);

const bikeRentalLeg = require("./__mocks__/bike-rental-leg.json");

Object.keys(Icons).forEach(key => {
  // Skip if not a leg icon.
  if (key.indexOf("LegIcon") === -1) return;
  // Use the associated mode icon for the given leg icon (defaulting to
  // standard mode icon).
  const ModeIcon = Icons[key.replace("Leg", "Mode")] || Icons.StandardModeIcon;
  const IconComponent = Icons[key];
  const story = () => {
    return (
      <Container>
        <IconComponent
          // Use the bike rental leg for the TriMet leg icon.
          leg={object("OTP Itinerary leg", bikeRentalLeg)}
          ModeIcon={ModeIcon}
        />
      </Container>
    );
  };
  allStories.add(key, story);
});
