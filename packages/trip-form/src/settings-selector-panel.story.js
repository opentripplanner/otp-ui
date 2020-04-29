import React, { Component } from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import SettingsSelectorPanel from "./SettingsSelectorPanel";

import commonCompanies from "./__mocks__/companies";
import commonModes from "./__mocks__/modes";
import commonModesEmpty from "./__mocks__/modes-empty";
import customIcons from "./__mocks__/custom-icons";
import trimet from "./__mocks__/trimet.styled";

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
  decorators: [decorator, withInfo]
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
      icons={customIcons}
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
