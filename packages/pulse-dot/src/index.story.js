import React from "react";
import { storiesOf } from "@storybook/react";

import { PulseDot, PulseCircle, PulseRing } from ".";

storiesOf("Pulse-Dot", module)
  .add("default", () => (
    <PulseDot>
      <PulseCircle></PulseCircle>
      <PulseRing></PulseRing>
    </PulseDot>
  ))
  .add("custom color", () => (
    <PulseDot>
      <PulseCircle inputColor="red"></PulseCircle>
      <PulseRing inputColor="pink"></PulseRing>
    </PulseDot>
  ))
  .add("custom size", () => (
    <PulseDot>
      <PulseCircle inputColor="red" size="50px"></PulseCircle>
      <PulseRing inputColor="pink" size="50px"></PulseRing>
    </PulseDot>
  ));
