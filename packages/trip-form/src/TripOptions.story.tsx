import { action } from "@storybook/addon-actions";
import React, { Component, ReactElement, useState } from "react";

import TripOptions from "./TripOptions";

import commonCompanies from "./__mocks__/companies";
import commonModes, {
  modesWithCompanyFirstMixedCategory
} from "./__mocks__/modes-en";

const onQueryParamChange = action("onQueryParamChange");

const storyQueryParams = {
  mode: "WALK,TRANSIT",
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

export default {
  component: TripOptions,
  title: "TripOptions",
  args: {
    featuredItemOverlayBackButton: true,
    supportedCompanies: commonCompanies
  },
  parameters: {
    // TODO: resolve a11y issues
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: false },
          { id: "duplicate-id-aria", enabled: false },
          { id: "duplicate-id", enabled: false }
        ]
      }
    }
  }
};

const Template = args => (
  <PanelWrapper>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <TripOptions {...args} />
  </PanelWrapper>
);

export const Default = Template.bind({});
Default.args = {
  supportedModes: commonModes
};

// This story serves as a regression test for a bug that led to
// categories in the structure the "CAR" category in this data to fail
// to be given a default selection
export const CompanyFirstMixedCategory = Template.bind({});
CompanyFirstMixedCategory.args = {
  supportedModes: modesWithCompanyFirstMixedCategory
};

export const CustomIconsAndCloseButton = (): ReactElement => {
  const [featuredOverlayShown, setFeaturedOverlayShown] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={!featuredOverlayShown}
        onClick={() => {
          setFeaturedOverlayShown(false);
        }}
      >
        close overlay
      </button>
      <PanelWrapper>
        <TripOptions
          featuredItemOverlayShown={setFeaturedOverlayShown}
          featuredItemOverlayEnabled={featuredOverlayShown}
          supportedCompanies={commonCompanies}
          supportedModes={commonModes}
          tripOptionIconFillOverride="white"
          checkboxIcons={{
            // eslint-disable-next-line react/display-name
            checked: () => <span>✅</span>,
            // eslint-disable-next-line react/display-name
            unchecked: () => <span>❌</span>
          }}
          CompanyIcon={({ company }) => (
            <i style={{ color: "black" }}>{company}</i>
          )}
          DetailedModeIcon={({ mode }) => <h1>{mode}</h1>}
          SimpleModeIcon={({ mode }) => <b>{mode}</b>}
          QuestionIcon={<span>😕</span>}
        />
      </PanelWrapper>
    </>
  );
};

// Disable storyshot for this story, as it is mostly the same as TripOptions
// except with a hook that storyshot can't handle
CustomIconsAndCloseButton.parameters = {
  storyshots: { disable: true }
};
