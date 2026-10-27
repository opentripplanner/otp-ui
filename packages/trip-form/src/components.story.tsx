import * as Icons from "@opentripplanner/icons";
import React, { ReactElement } from "react";
import { action } from "storybook/actions";

import submodeOptions from "./__mocks__/submode-options";
import trimet from "./__mocks__/trimet-styled";

import * as Core from ".";

// Events
const onChange = action("onChange");
const onClick = action("onClick");
const onQueryParamChange = action("onQueryParamChange");

const decorator = (Story: StoryType): ReactElement => (
  <>
    <p>Plain</p>
    <div>
      <Story />
    </div>
    <p>Styled</p>
    <div>{trimet(<Story />)}</div>
  </>
);

/**
 * Helper to simplify story declaration.
 */
function makeStory(Component?: React.ElementType, args: StoryArgs) {
  const BoundComponent = Component.bind({});
  BoundComponent.args = args;
  return BoundComponent;
}

export default {
  argTypes: {
    timeZone: {
      control: "select",
      options: ["America/New_York", "America/Los_Angeles"]
    }
  },
  decorators: [decorator],
  parameters: {
    // Hide all controls
    // (there are no args that the user can interactively change for this component).
    controls: {
      hideNoControlsWarning: true,
      include: ["timeZone", "departArriveDropdown"]
    }
  },
  title: "Trip Form Components"
} as Meta;

export const checkboxSelector = makeStory(Core.CheckboxSelector, {
  label: "Check me.",
  name: "MyParam",
  onChange,
  style: { display: "inline-block", width: "250px" }
});

export const sliderSelector = makeStory(Core.SliderSelector, {
  label: "Drag me.",
  labelHigh: "high",
  labelLow: "low",
  max: 20,
  min: 0.5,
  name: "MyParam",
  onChange,
  step: 0.5,
  style: { display: "inline-block", width: "250px" },
  value: 3
});
// This error may be raised by us rendering two copies of each story.
sliderSelector.parameters = {
  a11y: {
    config: { rules: [{ id: "duplicate-id-active", reviewOnFail: true }] }
  }
};

export const dateTimeSelector = makeStory(Core.DateTimeSelector, {
  date: "2020-02-15",
  dateFormatLegacy: "YY-M-d",
  departArrive: "NOW",
  departArriveDropdown: true,
  forceLegacy: false,
  onQueryParamChange,
  time: "14:17",
  timeFormatLegacy: "HH:mm",
  timeZone: "America/New_York"
});

export const departArriveDropdown = makeStory(Core.DepartArriveDropdown, {
  departArrive: "NOW",
  timeZone: "America/New_York",
  onQueryParamChange
});

export const dropdownSelector = makeStory(Core.DropdownSelector, {
  label: "Pick an option:",
  name: "MyParam",
  onChange,
  options: [
    {
      text: "Option 1",
      value: "Value1"
    },
    {
      text: "Option 2",
      value: "Value2"
    }
  ],
  style: { display: "inline-block", width: "250px" },
  value: "Value2"
});
const Space = () => (
  <span
    style={{
      display: "inline-block",
      width: "1em"
    }}
  />
);

export const modeButtons = (): ReactElement => (
  <div>
    <div>
      <Core.ModeButton onClick={onClick} title="Normal">
        <Icons.Max />
        +
        <Icons.Bike />
        Go by train
        <span style={{ fontSize: "150%", color: "#b03030" }}> or </span> bike
      </Core.ModeButton>
      <Space />
      <Core.ModeButton selected onClick={onClick} title="Active">
        <Icons.Max />
        Train
      </Core.ModeButton>
      <Space />
      <Core.ModeButton
        enabled={false}
        label="Can't Select!"
        onClick={onClick}
        title="Disabled"
      >
        <Icons.AlertSolid />
        Can&apos;t select!
        <Icons.Alert />
      </Core.ModeButton>
    </div>
    <div>
      <Core.ModeButton onClick={onClick} showTitle={false} title="Walk Only">
        <Icons.Max />
        Walk Only
      </Core.ModeButton>
    </div>
  </div>
);
export const submodeSelector = makeStory(Core.SubmodeSelector, {
  inline: false,
  label: "Submodes:",
  modes: submodeOptions,
  onChange
});
