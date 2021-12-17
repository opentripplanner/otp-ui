import flatten from "flat";
import { ClassicModeIcon } from "@opentripplanner/icons";
import { action } from "@storybook/addon-actions";
import React, { Component, ReactElement } from "react";
import { IntlProvider } from "react-intl";

import SettingsSelectorPanel from "./SettingsSelectorPanel";

import commonCompanies from "./test-utils/companies";
import commonModes from "./test-utils/modes";
import commonModesEmpty from "./test-utils/modes-empty";
import trimet from "./test-utils/trimet-styled";

import englishMessages from "../i18n/en-US.yml";
import frenchMessages from "../i18n/fr.yml";

/**
 * Describes args passed to stories.
 */
interface StoryArgs {
  locale?: string;
}

const headingStyle = {
  fontFamily: "sans-serif",
  fontSize: "16px"
};

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

const decoratorPropDescription = "(This prop is used by the decorator.)";
// Hide story controls for some props (but still display in the controls and the docs section).
const noControl = {
  control: { type: false }
};

const intlDecorator = (
  Story: StoryType,
  context: {
    args: StoryArgs;
  }
): ReactElement => {
  const { args } = context;
  const { locale } = args;
  const messages = locale === "en-US" ? englishMessages : frenchMessages;

  return (
    <IntlProvider locale={locale} messages={flatten(messages)}>
      <div>
        <p style={headingStyle}>Plain</p>
        <div>
          <Story />
        </div>

        <p style={headingStyle}>Styled</p>
        <div>{trimet(<Story />)}</div>
      </div>
    </IntlProvider>
  );
};

export default {
  argTypes: {
    className: noControl,
    locale: {
      control: "radio",
      description: decoratorPropDescription,
      options: ["en-US", "fr"]
    }
  },
  args: {
    locale: "en-US"
  },
  component: SettingsSelectorPanel,
  decorators: [intlDecorator],
  title: "SettingsSelectorPanel"
};

const SettingsPanelTemplate = args => (
  <PanelWrapper>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <SettingsSelectorPanel {...args} />
  </PanelWrapper>
);

/**
 * Helper to simplify story declaration.
 */
function makeStory(args: StoryArgs | SettingsSelectorPanelProps) {
  const BoundTripDetails = SettingsPanelTemplate.bind({});
  BoundTripDetails.args = args;
  return BoundTripDetails;
}

export const settingsSelectorPanel = makeStory({
  supportedModes: commonModes,
  supportedCompanies: commonCompanies
});

export const settingsSelectorPanelWithCustomIcons = makeStory({
  ModeIcon: ClassicModeIcon,
  supportedModes: commonModes,
  supportedCompanies: commonCompanies
});

export const settingsSelectorPanelWithUndefinedParams = makeStory({
  supportedModes: commonModesEmpty,
  supportedCompanies: undefined
});
