import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { withKnobs, object } from "@storybook/addon-knobs";
import * as Icons from "@opentripplanner/icons";

import CheckboxSelector from "./CheckboxSelector";
import DropdownSelector from "./DropdownSelector";
import GeneralSettingsPanel from "./GeneralSettingsPanel";

import ModeButton from "./ModeButton";
import ModeIcon from "./ModeIcon";
import ModeIconWrap from "./__mocks__/mode-icon-wrap";
import modeOptions from "./__mocks__/mode-options";
import ModeSelector from "./ModeSelector";
import SubmodeSelector from "./SubmodeSelector";
import submodeOptions from "./__mocks__/submode-options";

const background = story => (
  <div
    style={{
      backgroundColor: "#F0F0F0",
      height: "200px",
      padding: "15px"
    }}
  >
    {story()}
  </div>
);

export default {
  title: "Trip Form Components",
  decorators: [withInfo, withKnobs, background]
};

// Events
const onChange = action("onChange");
const onClick = action("onClick");
const onQueryParamChange = action("onQueryParamChange");

export const checkboxSelector = () => (
  <CheckboxSelector
    name="MyParam"
    style={{ display: "inline-block", width: "250px" }}
    label="Check me."
    onChange={onChange}
  />
);

export const dropdownSelector = () => (
  <DropdownSelector
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
  <GeneralSettingsPanel
    query={{
      mode: object("mode", "WALK,BUS,TRAM,SUBWAY"),
      routingType: "ITINERARY"
    }}
    onQueryParamChange={onQueryParamChange}
  />
);

export const modeIcon = () => (
  <ModeIconWrap>
    <ModeIcon mode={object("mode", "BICYCLE")} />
  </ModeIconWrap>
);

export const modeButton = () => (
  <div>
    <div>
      <ModeButton onClick={onClick} title="Normal">
        <Icons.Max />
        +
        <Icons.Bike />
        Go by train or bike
      </ModeButton>
    </div>
    <div>
      <ModeButton selected onClick={onClick} title="Active">
        <Icons.Max />
        Train
      </ModeButton>
    </div>
    <div>
      <ModeButton
        enabled={false}
        label="Can't Select!"
        onClick={onClick}
        title="Disabled"
      >
        <Icons.AlertSolid />
        Can&apos;t select!
        <Icons.Alert />
      </ModeButton>
    </div>
    <div>
      <ModeButton onClick={onClick} showTitle={false} title="Walk Only">
        <Icons.Max />
        Walk Only
      </ModeButton>
    </div>
  </div>
);

export const modeSelector = () => (
  <ModeSelector modes={modeOptions} onChange={onChange} />
);

export const submodeSelector = () => (
  <SubmodeSelector modes={submodeOptions} onChange={onChange} />
);
