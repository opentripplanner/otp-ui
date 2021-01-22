import { transitModes } from "@opentripplanner/core-utils/lib/itinerary";
import { select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";

import * as Icons from ".";

function Container({ children }) {
  return <div style={{ width: 40 }}>{children}</div>;
}

const allStories = storiesOf("Mode Icons", module).addDecorator(withKnobs);

const options = ["TRANSIT", "WALK", "BICYCLE", ...transitModes];
const defaultValue = "TRANSIT";

Object.keys(Icons).forEach(key => {
  // Skip if not a mode icon.
  if (key.indexOf("ModeIcon") === -1) return;
  const IconComponent = Icons[key];
  const story = () => (
    <Container>
      <IconComponent mode={select("Mode", options, defaultValue)} />
    </Container>
  );
  allStories.add(key, story);
});
