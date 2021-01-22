import React from "react";
import { storiesOf } from "@storybook/react";

import * as Icons from ".";

function Container({ children }) {
  return <div style={{ width: 40 }}>{children}</div>;
}

const allStories = storiesOf("Icons", module);

const bikeRentalItinerary = require("./__mocks__/bike-rental-gbfs.json");

const [walkLeg, bikeRentalLeg] = bikeRentalItinerary.legs;

Object.keys(Icons).forEach(key => {
  // Determine if icon is leg or mode icon (special icons that require props).
  const isLegIcon = key.indexOf("LegIcon") !== -1;
  const isModeIcon = key.indexOf("ModeIcon") !== -1;
  const isTriMet = key.indexOf("TriMet") !== -1;
  // Use the associated mode icon for the given leg icon (defaulting to
  // standard mode icon).
  const ModeIcon = Icons[key.replace("Leg", "Mode")] || Icons.StandardModeIcon;
  const props = isModeIcon
    ? { mode: "TRANSIT" }
    : isLegIcon
    ? {
        // Use the bike rental leg for the TriMet leg icon.
        leg: isTriMet ? bikeRentalLeg : walkLeg,
        ModeIcon
      }
    : {};
  const IconComponent = Icons[key];
  const story = () => {
    const { leg, mode } = props;
    const label = leg ? leg.mode : mode;
    return (
      <Container>
        {label}
        <IconComponent {...props} />
      </Container>
    );
  };
  allStories.add(key, story);
});
