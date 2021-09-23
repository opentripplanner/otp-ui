import {
  ClassicModeIcon,
  TriMetModeIcon2021 as TriMetModeIcon
} from "@opentripplanner/icons";

import { action } from "@storybook/addon-actions";
import React, { Component } from "react";

import SettingsSelectorPanel from "./SettingsSelectorPanel";
import TripOptions from "./TripOptions";

import commonCompanies from "./test-utils/companies";
import commonModes from "./test-utils/modes";
import commonModesEmpty from "./test-utils/modes-empty";
import trimet from "./test-utils/trimet-styled";

const headingStyle = {
  fontFamily: "sans-serif",
  fontSize: "16px"
};

const onQueryParamChange = action("onQueryParamChange");

const storyQueryParams = {
  mode: "WALK",
  routingType: "ITINERARY"
};

class PanelWrapper extends Component {
  constructor() {
    super();
    this.state = { queryParams: storyQueryParams };
  }

  handleOnQueryParamChange = queryParam => {
    const { queryParams } = this.state;
    const newParams = { ...queryParams, ...queryParam };

    onQueryParamChange(queryParam);

    this.setState({
      queryParams: newParams
    });
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props;
    const { queryParams } = this.state;
    return React.cloneElement(children, {
      onQueryParamChange: this.handleOnQueryParamChange,
      queryParams
    });
  }
}

const decorator = story => (
  <div>
    <p style={headingStyle}>Plain</p>
    <div>{story()}</div>

    <p style={headingStyle}>Styled</p>
    <div>{trimet(story())}</div>
  </div>
);

export default {
  title: "SettingsSelectorPanel",
  component: SettingsSelectorPanel,
  decorators: [decorator]
};

export const settingsSelectorPanel = () => (
  <PanelWrapper>
    <SettingsSelectorPanel
      supportedModes={commonModes}
      supportedCompanies={commonCompanies}
    />
  </PanelWrapper>
);

export const settingsSelectorPanelWithCustomIcons = () => (
  <PanelWrapper>
    <SettingsSelectorPanel
      ModeIcon={ClassicModeIcon}
      supportedModes={commonModes}
      supportedCompanies={commonCompanies}
    />
  </PanelWrapper>
);

export const settingsSelectorPanelUndefinedParams = () => (
  <PanelWrapper>
    <SettingsSelectorPanel
      supportedModes={commonModesEmpty}
      supportedCompanies={undefined}
    />
  </PanelWrapper>
);

export const tripOptions = () => (
  <PanelWrapper>
    <TripOptions
      supportedCompanies={commonCompanies}
      supportedModes={commonModes}
      SimpleModeIcon={TriMetModeIcon}
    />
  </PanelWrapper>
);
export const tripOptionsWithCustomIcons = () => (
  <PanelWrapper>
    <TripOptions
      supportedCompanies={commonCompanies}
      supportedModes={commonModes}
      QuestionIcon={<span>😕</span>}
      SimpleModeIcon={({ mode }) => <b>{mode}</b>}
      DetailedModeIcon={({ mode }) => <h1>{mode}</h1>}
      CompanyIcon={({ company }) => <i style={{ color: "black" }}>{company}</i>}
    />
  </PanelWrapper>
);

// TODO: resolve a11y issues
const disableA11yParamters = {
  a11y: {
    config: {
      rules: [
        { id: "color-contrast", enabled: false },
        { id: "duplicate-id-aria", enabled: false },
        { id: "duplicate-id", enabled: false }
      ]
    }
  }
};

tripOptions.parameters = disableA11yParamters;
tripOptionsWithCustomIcons.parameters = disableA11yParamters;
