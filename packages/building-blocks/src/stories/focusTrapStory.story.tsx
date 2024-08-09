import React from "react";
import FocusTrapWrapper from "../focus-trap-wrapper";

export default {
  title: "Building-Blocks/FocusTrapWrapper",
  component: FocusTrapWrapper
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
    id="various-els-story"
    focusElements={["button", "a", "div", "input", "select"]}
  >
    <button type="button">Button 1</button>
    <a href="/">link</a>
    <div tabIndex={-1}>focusable div</div>
    <input disabled type="text"></input>
    <input type="text"></input>
    <select>
      <option>Option 1</option>
      <option>Option 2</option>
    </select>
  </FocusTrapWrapper>
);
