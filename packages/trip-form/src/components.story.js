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
import ModeSelector from "./ModeSelector";
import SubmodeSelector from "./SubmodeSelector";

import ModeIconWrap from "./__mocks__/mode-icon-wrap";
import modeOptions from "./__mocks__/mode-options";
import commonModes from "./__mocks__/modes";
import submodeOptions from "./__mocks__/submode-options";
import * as TriMetStyled from "./__mocks__/trimet.styled";

// eslint-disable-next-line react/destructuring-assignment, react/prop-types
const Wrapper = props => <div>{props.children}</div>;

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
    supportedModes={commonModes}
  />
);

export const modeIcon = () => (
  <ModeIconWrap>
    <ModeIcon mode={object("mode", "BICYCLE")} />
  </ModeIconWrap>
);

const modeButtonStory = (WrapperType, ButtonType) => (
  <WrapperType>
    <div>
      <ButtonType onClick={onClick} title="Normal">
        <Icons.Max />
        +
        <Icons.Bike />
        Go by train or bike
      </ButtonType>
    </div>
    <div>
      <ButtonType selected onClick={onClick} title="Active">
        <Icons.Max />
        Train
      </ButtonType>
    </div>
    <div>
      <ButtonType
        enabled={false}
        label="Can't Select!"
        onClick={onClick}
        title="Disabled"
      >
        <Icons.AlertSolid />
        Can&apos;t select!
        <Icons.Alert />
      </ButtonType>
    </div>
    <div>
      <ButtonType onClick={onClick} showTitle={false} title="Walk Only">
        <Icons.Max />
        Walk Only
      </ButtonType>
    </div>
  </WrapperType>
);

export const modeButtonPlain = modeButtonStory(Wrapper, ModeButton);
export const modeButtonTrimet = modeButtonStory(
  TriMetStyled.Ambient,
  TriMetStyled.ModeButtonControl
);

export const modeSelector = () => (
  <ModeSelector modes={modeOptions} onChange={onChange} />
);

export const submodeSelector = () => (
  <SubmodeSelector
    label="Submodes:"
    modes={submodeOptions}
    onChange={onChange}
  />
);
