import React from "react";
import { action } from "@storybook/addon-actions";
import { boolean, text, withKnobs } from "@storybook/addon-knobs";
import * as Icons from "@opentripplanner/icons";

import * as Core from ".";

import commonModes from "./test-utils/modes";
import modeOptions from "./test-utils/mode-options";
import submodeOptions from "./test-utils/submode-options";
import trimet from "./test-utils/trimet-styled";

const headingStyle = {
  fontFamily: "sans-serif",
  fontSize: "16px"
};

const decorator = story => (
  <div>
    <p style={headingStyle}>Plain</p>
    <div>{story()}</div>

    <p style={headingStyle}>Styled</p>
    <div>{trimet(story())}</div>
  </div>
);

export default {
  title: "Trip Form Components",
  decorators: [decorator, withKnobs],
  subcomponents: {
    CheckboxSelector: Core.CheckboxSelector,
    DateTimeSelector: Core.DateTimeSelector,
    DropdownSelector: Core.DropdownSelector,
    GeneralSettingsPanel: Core.GeneralSettingsPanel,
    ModeButton: Core.ModeButton,
    ModeSelector: Core.ModeSelector,
    SubmodeSelector: Core.SubmodeSelector
  }
};

// Events
const onChange = action("onChange");
const onClick = action("onClick");
const onQueryParamChange = action("onQueryParamChange");

export const checkboxSelector = () => (
  <Core.CheckboxSelector
    name="MyParam"
    style={{ display: "inline-block", width: "250px" }}
    label="Check me."
    onChange={onChange}
  />
);

export const dateTimeSelector = () => (
  <Core.DateTimeSelector
    departArrive="NOW"
    date="2020-02-15"
    dateFormatLegacy={text("dateFormatLegacy", "YY-M-d")}
    forceLegacy={boolean("forceLegacy", false)}
    time="14:17"
    timeFormatLegacy={text("timeFormatLegacy", "HH:mm")}
    onQueryParamChange={onQueryParamChange}
  />
);

export const dropdownSelector = () => (
  <Core.DropdownSelector
    name="MyParam"
    style={{ display: "inline-block", width: "250px" }}
    label="Pick an option:"
    options={[
      {
        text: "Option 1",
        value: "Value1"
      },
      {
        text: "Option 2",
        value: "Value2"
      }
    ]}
    onChange={onChange}
    value="Value2"
  />
);

export const generalSettingsPanel = () => (
  <Core.GeneralSettingsPanel
    query={{
      mode: text("mode", "WALK,BUS,TRAM,SUBWAY"),
      routingType: "ITINERARY"
    }}
    onQueryParamChange={onQueryParamChange}
    supportedModes={commonModes}
  />
);

const Space = () => (
  <span
    style={{
      display: "inline-block",
      width: "1em"
    }}
  />
);

export const modeButtons = () => (
  <div>
    <div>
      <Core.ModeButton onClick={onClick} title="Normal">
        <Icons.Max />
        +
        <Icons.Bike />
        Go by train
        <span style={{ fontSize: "150%", color: "#CD0000" }}> or </span> bike
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

export const modeSelector = () => (
  <Core.ModeSelector modes={modeOptions} onChange={onChange} />
);

export const submodeSelector = () => (
  <Core.SubmodeSelector
    inline={boolean("inline", false)}
    label="Submodes:"
    modes={submodeOptions}
    onChange={onChange}
  />
);
