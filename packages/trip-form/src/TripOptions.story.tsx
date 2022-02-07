import { action } from "@storybook/addon-actions";
import React, { Component, ReactElement, useState } from "react";

import TripOptions from "./TripOptions";

import commonCompanies from "./__mocks__/companies";
import commonModes from "./__mocks__/modes-en";

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
  title: "TripOptions"
};

export const tripOptions = (): ReactElement => (
  <PanelWrapper>
    <TripOptions
      featuredItemOverlayBackButton
      supportedCompanies={commonCompanies}
      supportedModes={commonModes}
    />
  </PanelWrapper>
);
export const tripOptionsWithCustomIconsAndCloseButton = (): ReactElement => {
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

// TODO: resolve a11y issues
const disableA11yParameters = {
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

tripOptions.parameters = disableA11yParameters;

// Disable storyshot for this story, as it is mostly the same as TripOptions except with
// a hook that storyshot can't handle
tripOptionsWithCustomIconsAndCloseButton.parameters = {
  storyshots: { disable: true },
  ...disableA11yParameters
};
