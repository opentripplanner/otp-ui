import React from "react";
import { storiesOf } from "@storybook/react";

import * as Icons from ".";

function Container({ children }) {
  return <div style={{ width: 40 }}>{children}</div>;
}

const allStories = storiesOf("Icons", module);

const noStoryComponents = [
  "ClassicLegIcon",
  "ClassicModeIcon",
  "TriMetLegIcon",
  "TriMetModeIcon",
  "TriMetModLegIcon",
  "TriMetModModeIcon"
];

Object.keys(Icons).forEach(iconKey => {
  if (noStoryComponents.indexOf(iconKey) > -1) return;
  const Component = Icons[iconKey];
  allStories.add(iconKey, () => (
    <Container>
      <Component />
    </Container>
  ));
});
