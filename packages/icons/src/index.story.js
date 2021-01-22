import React from "react";
import { storiesOf } from "@storybook/react";

import * as Icons from ".";

function Container({ children }) {
  return <div style={{ width: 40 }}>{children}</div>;
}

const allStories = storiesOf("Icons", module);

Object.keys(Icons).forEach(key => {
  // Skip leg and mode icons.
  const isLegIcon = key.indexOf("LegIcon") !== -1;
  const isModeIcon = key.indexOf("ModeIcon") !== -1;
  if (isLegIcon || isModeIcon) return;
  const IconComponent = Icons[key];
  const story = () => (
    <Container>
      <IconComponent />
    </Container>
  );
  allStories.add(key, story);
});
