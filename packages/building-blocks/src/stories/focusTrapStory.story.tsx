import React from "react";
import FocusTrapWrapper from "../focus-trap-wrapper";

export default {
  component: FocusTrapWrapper,
  title: "Building-Blocks/FocusTrapWrapper"
};

export const FocusTrapAroundButtonSet = (): React.ReactElement => (
  <FocusTrapWrapper id="button-set-story">
    <button type="button">Button 1</button>
    <button type="button">Button 2</button>
    <button type="button">Button 3</button>
    <button type="button">Button 4</button>
  </FocusTrapWrapper>
);

export const FocusTrapWithVariousEls = (): React.ReactElement => (
  <FocusTrapWrapper
    focusElements={["button", "a", "div", "input", "select"]}
    id="various-els-story"
  >
    <button type="button">Button 1</button>
    <br />
    <a href="/">link</a>
    <br />
    <div tabIndex={-1}>focusable div</div>
    <label htmlFor="disabled-input">
      Input (disabled) <input id="disabled-input" disabled type="text" />{" "}
    </label>

    <br />
    <label htmlFor="input">
      Input <input id="input" type="text" />
    </label>

    <br />
    <label htmlFor="select">
      Select{" "}
      <select id="select">
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    </label>
  </FocusTrapWrapper>
);
