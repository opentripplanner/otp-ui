import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";

import { PulseDot, PulseCircle, PulseRing } from ".";

describe("Input", () => {
  test("renders correctly", () => {
    const tree = renderer
      .create(
        <PulseDot>
          <PulseCircle></PulseCircle>
          <PulseRing></PulseRing>
        </PulseDot>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
