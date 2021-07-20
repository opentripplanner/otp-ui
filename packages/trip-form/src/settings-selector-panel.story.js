import { ClassicModeIcon } from "@opentripplanner/icons";

import React, { Component } from "react";
import { action } from "@storybook/addon-actions";

import SettingsSelectorPanel from "./SettingsSelectorPanel";

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
