import { ClassicModeIcon } from "@opentripplanner/icons";

import { action } from "@storybook/addon-actions";
import React, { Component } from "react";
import styled from "styled-components";

import SettingsSelectorPanel from "./SettingsSelectorPanel";
import TripOptions from "./TripOptions";

import commonCompanies from "./__mocks__/companies";
import commonModes from "./__mocks__/modes";
import commonModesEmpty from "./__mocks__/modes-empty";
import trimet from "./__mocks__/trimet.styled";

// SVG icons
import { walkIcon, bikeIcon, carIcon, scooterIcon } from "./__mocks__/icons";

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

const Button = styled.button`
  display: block;
  margin-bottom: 10px;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0px;
  > button {
    width: 66%;
    cursor: pointer;
  }
  > .line-break {
    width: 100%;
  }
`;

export const tripOptions = () => (
  <PanelWrapper>
    <TripOptions
      footer={
        <FooterContainer>
          <Button type="button">Plan trip</Button>
          <div className="line-break" />
          <Button type="button">Save Options</Button>
        </FooterContainer>
      }
      supportedModes={commonModes}
      supportedCompanies={commonCompanies}
      modeIcons={{
        WALK: walkIcon,
        BICYCLE_RENT: bikeIcon,
        BICYCLE: bikeIcon,
        CAR_HAIL: carIcon,
        CAR_PARK: carIcon,
        MICROMOBILITY_RENT: scooterIcon
      }}
    />
  </PanelWrapper>
);
