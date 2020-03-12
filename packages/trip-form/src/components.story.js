import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";
import * as Icons from "@opentripplanner/icons";

import * as Core from ".";
import ModeIcon from "./ModeIcon";

import ModeIconWrap from "./__mocks__/mode-icon-wrap";
import modeOptions from "./__mocks__/mode-options";
import commonModes from "./__mocks__/modes";
import customIcons from "./__mocks__/custom-icons";
import submodeOptions from "./__mocks__/submode-options";
import trimet from "./__mocks__/trimet.styled";

export default {
  title: "Trip Form Components",
  decorators: [withInfo, withKnobs]
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
export const checkBoxSelectorStyled = () => trimet(checkboxSelector());

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
export const dropdownSelectorStyled = () => trimet(dropdownSelector());

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
export const generalSettingsPanelStyled = () => trimet(generalSettingsPanel());

export const modeIcon = () => (
  <ModeIconWrap>
    <ModeIcon mode={text("mode", "BICYCLE")} />
  </ModeIconWrap>
);

export const modeIconWithCustomIcons = () => (
  <ModeIconWrap>
    <ModeIcon icons={customIcons} mode={text("mode", "TRANSIT")} />
  </ModeIconWrap>
);

export const modeButton = () => (
  <div>
    <div>
      <Core.ModeButton onClick={onClick} title="Normal">
        <Icons.Max />
        +
        <Icons.Bike />
        Go by train
        <span style={{ fontSize: "150%", color: "red" }}> or </span> bike
      </Core.ModeButton>
    </div>
    <div>
      <Core.ModeButton selected onClick={onClick} title="Active">
        <Icons.Max />
        Train
      </Core.ModeButton>
    </div>
    <div>
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
export const modeButtonStyled = () => trimet(modeButton());

export const modeSelector = () => (
  <Core.ModeSelector modes={modeOptions} onChange={onChange} />
);
export const modeSelectorStyled = () => trimet(modeSelector());

export const submodeSelector = () => (
  <Core.SubmodeSelector
    inline={boolean("inline", false)}
    label="Submodes:"
    modes={submodeOptions}
    onChange={onChange}
  />
);
export const submodeSelectorStyled = () => trimet(submodeSelector());
