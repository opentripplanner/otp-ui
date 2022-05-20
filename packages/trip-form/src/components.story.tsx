import * as Icons from "@opentripplanner/icons";
import React from "react";
import { action } from "@storybook/addon-actions";

import * as Core from ".";

import commonModes from "./__mocks__/modes-en";
import modeOptions from "./__mocks__/mode-options";
import submodeOptions from "./__mocks__/submode-options";
import trimet from "./__mocks__/trimet-styled";

import { SettingsSelectorPanel } from "./styled";

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

const GeneralSettingsTemplate = (args: StoryArgs) => (
  <Core.GeneralSettingsPanel
    onQueryParamChange={onQueryParamChange}
    query={{
      mode: args.mode,
      otp2: args.otp2,
      routingType: "ITINERARY"
    }}
    queryParamMessages={args.queryParamMessages}
    supportedModes={commonModes}
  />
);

export default {
  component: SettingsSelectorPanel,
  decorators: [decorator],
  parameters: {
    // Hide all controls
    // (there are no args that the user can interactively change for this component).
    controls: {
      hideNoControlsWarning: true,
      include: []
    }
  },
  title: "Trip Form Components"
} as Meta;

// Custom general settings messages.
// You can customize as little or as much, depending on your needs
// (Tweaking a message requires fewer entries, and providing translations requires more entries below).
const queryParamMessages = {
  maxWalkDistance: {
    label: "Max Walk Distance In Meters (custom)",
    options: [
      {
        text: "200 m (custom)",
        value: 200
      },
      {
        text: "500 m (custom)",
        value: 500
      }
    ]
  },
  optimize: {
    label: "Walk settings (custom)",
    options: [
      {
        text: "Quickest trip (custom)",
        value: "QUICK"
      },
      {
        text: "Prefer fewer transfers (custom)",
        value: "TRANSFERS"
      }
    ]
  }
};

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

export const dateTimeSelector = makeStory(Core.DateTimeSelector, {
  date: "2020-02-15",
  dateFormatLegacy: "YY-M-d",
  departArrive: "NOW",
  forceLegacy: false,
  onQueryParamChange,
  time: "14:17",
  timeFormatLegacy: "HH:mm"
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

export const generalSettingsPanel = makeStory(GeneralSettingsTemplate, {
  mode: "WALK,BUS,TRAM,SUBWAY"
});

export const generalSettingsPanelWithOtp2 = makeStory(GeneralSettingsTemplate, {
  mode: "WALK,BUS,TRAM,SUBWAY",
  otp2: true
});

export const generalSettingsPanelWithCustomMessages = makeStory(
  GeneralSettingsTemplate,
  {
    mode: "WALK,BUS,TRAM,SUBWAY",
    queryParamMessages
  }
);

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

export const modeSelector = (): ReactElement => (
  <Core.ModeSelector modes={modeOptions} onChange={onChange} />
);

export const submodeSelector = makeStory(Core.SubmodeSelector, {
  inline: false,
  label: "Submodes:",
  modes: submodeOptions,
  onChange
});
