import flatten from "flat";
import { ClassicModeIcon } from "@opentripplanner/icons";
import { action } from "@storybook/addon-actions";
import React, { Component, ReactElement } from "react";
import { IntlProvider } from "react-intl";
import SettingsSelectorPanel from "./SettingsSelectorPanel";

import commonCompanies from "./__mocks__/companies";
import commonModesEmpty from "./__mocks__/modes-empty";
import trimet from "./__mocks__/trimet-styled";

import englishMessages from "../i18n/en-US.yml";
import frenchMessages from "../i18n/fr.yml";

import commonModesEnglish from "./__mocks__/modes-en";
import commonModesFrench from "./__mocks__/modes-fr";

/**
 * Describes args passed to stories.
 */
interface StoryArgs {
  locale?: string;
  useCustomMessages?: boolean;
  useStyle?: boolean;
}

const onQueryParamChange = action("onQueryParamChange");

class PanelWrapper extends Component {
  constructor() {
    super();
    this.state = {
      queryParams: {
        mode: "WALK,TRANSIT",
        routingType: "ITINERARY"
      }
    };
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
// Hide some story args completely.
const hiddenProp = {
  table: { disable: true }
};

const intlDecorator = (
  Story: StoryType,
  context: {
    args: StoryArgs;
  }
): ReactElement => {
  const { args } = context;
  const { locale, useStyle } = args;
  const messages = locale === "en-US" ? englishMessages : frenchMessages;

  return (
    <IntlProvider locale={locale} messages={flatten(messages)}>
      <div>{useStyle ? trimet(<Story />) : <Story />} </div>
    </IntlProvider>
  );
};

export default {
  argTypes: {
    className: hiddenProp,
    locale: {
      control: "inline-radio",
      description: decoratorPropDescription,
      options: ["en-US", "fr"]
    },
    ModeIcon: noControl,
    queryParams: noControl,
    style: hiddenProp,
    supportedCompanies: noControl,
    supportedModes: noControl
  },
  args: {
    locale: "en-US",
    useCustomMessages: false,
    useStyle: false
  },
  component: SettingsSelectorPanel,
  decorators: [intlDecorator],
  // Use of 'ṯ' character instead of 't' is intended.
  // Including the word "Setting" in the title breaks storybook's lower pane.
  title: "SeṯtingsSelectorPanel"
};

const SettingsPanelTemplate = args => (
  <PanelWrapper>
    <SettingsSelectorPanel
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...args}
      queryParamMessages={
        args.useCustomMessages
          ? {
              walkSpeed: {
                label: "Custom walk speed label",
                options: [
                  {
                    text: "3 kph custom speed value",
                    value: 10
                  }
                ]
              }
            }
          : null
      }
      supportedModes={
        args.supportedModes ||
        (args.locale === "en-US" ? commonModesEnglish : commonModesFrench)
      }
    />
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
  supportedCompanies: commonCompanies
});

export const settingsSelectorPanelWithCustomIcons = makeStory({
  ModeIcon: ClassicModeIcon,
  supportedCompanies: commonCompanies
});

export const settingsSelectorPanelWithUndefinedParams = makeStory({
  supportedModes: commonModesEmpty,
  supportedCompanies: undefined
});
