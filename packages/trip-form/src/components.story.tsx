import flatten from "flat";
import * as Icons from "@opentripplanner/icons";
import React from "react";
import { IntlProvider } from "react-intl";
import { action } from "@storybook/addon-actions";

import * as Core from ".";

import commonModes from "./test-utils/modes";
import modeOptions from "./test-utils/mode-options";
import submodeOptions from "./test-utils/submode-options";
import trimet from "./test-utils/trimet-styled";

import englishMessages from "../i18n/en-US.yml";
import { SettingsSelectorPanel } from "./styled";

// Events
const onChange = action("onChange");
const onClick = action("onClick");
const onQueryParamChange = action("onQueryParamChange");

const headingStyle = {
  fontFamily: "sans-serif",
  fontSize: "16px"
};

const intlDecorator = (Story: StoryType): ReactElement => (
  <IntlProvider locale="en-US" messages={flatten(englishMessages)}>
    <div>
      <p style={headingStyle}>Plain</p>
      <div>
        <Story />
      </div>

      <p style={headingStyle}>Styled</p>
      <div style={{ color: "#333" }}>{trimet(<Story />)}</div>
    </div>
  </IntlProvider>
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
      routingType: "ITINERARY"
    }}
    queryParamMessages={args.queryParamMessages}
    supportedModes={commonModes}
  />
);

// Hide story controls for some props (but still display in the controls and the docs section).
const noControl = {
  control: { type: false }
};

export default {
  argTypes: {
    className: noControl,
    modes: noControl,
    onChange: noControl,
    onQueryParamChange: noControl,
    style: noControl
  },
  component: SettingsSelectorPanel,
  decorators: [intlDecorator],
  parameters: { controls: { sort: "alpha" } },
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
        value: 100
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
        <span style={{ fontSize: "150%", color: "rgb(255, 195, 195)" }}>
          {" "}
          or{" "}
        </span>{" "}
        bike
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
