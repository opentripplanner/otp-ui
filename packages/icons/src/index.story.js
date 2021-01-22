import React from "react";
import { storiesOf } from "@storybook/react";

import * as Icons from ".";

function Container({ children }) {
  return <div style={{ width: 40 }}>{children}</div>;
}

const allStories = storiesOf("Icons", module);

Object.keys(Icons)
  // Skip leg and mode icons.
  .filter(key => key.indexOf("LegIcon") > -1 && key.indexOf("ModeIcon") > -1)
  .forEach(key => {
    const IconComponent = Icons[key];
    const story = () => (
      <Container>
        <IconComponent />
      </Container>
    );
    allStories.add(key, story);
  });
