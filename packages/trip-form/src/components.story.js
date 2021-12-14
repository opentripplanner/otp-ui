import React, { useState } from "react";
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
    <div style={{ color: "#333" }}>{trimet(story())}</div>
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

export const checkboxSelector = () => (
  <Core.CheckboxSelector
    name="MyParam"
    style={{ display: "inline-block", width: "250px" }}
    label="Check me."
    onChange={onChange}
  />
);

export const dateTimeSelector = () => {
  const [state, setState] = useState({
    date: "2020-02-15",
    departArrive: "NOW",
    time: "14:17"
  });

  const dateTimeSelOnQueryParamChange = evt => {
    setState({
      ...state,
      ...evt
    });
    onQueryParamChange(evt);
  };

  return (
    <Core.DateTimeSelector
      departArrive={state.departArrive}
      date={state.date}
      dateFormatLegacy={text("dateFormatLegacy", "YY-M-d")}
      forceLegacy={boolean("forceLegacy", false)}
      time={state.time}
      timeFormatLegacy={text("timeFormatLegacy", "HH:mm")}
      onQueryParamChange={dateTimeSelOnQueryParamChange}
    />
  );
};

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

export const generalSettingsPanelWithCustomMessages = () => (
  <Core.GeneralSettingsPanel
    onQueryParamChange={onQueryParamChange}
    query={{
      mode: text("mode", "WALK,BUS,TRAM,SUBWAY"),
      routingType: "ITINERARY"
    }}
    queryParamMessages={queryParamMessages}
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
        <span style={{ fontSize: "150%", color: "rgb(255, 195, 195);" }}>
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
