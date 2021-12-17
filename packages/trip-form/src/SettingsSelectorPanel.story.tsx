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

// Customize a few strings to demonstrate French locale.
// Normally, a translator would go through the entire query-params file.
const frenchQueryParamMessages = {
  maxWalkDistance: {
    label: "Distance max. à pied",
    options: [
      {
        text: "200 m",
        value: 200
      },
      {
        text: "500 m",
        value: 500
      }
    ]
  },
  optimize: {
    label: "Privilégier les trajets",
    options: [
      {
        text: "les plus rapides",
        value: "QUICK"
      },
      {
        text: "avec le moins de correspondances",
        value: "TRANSFERS"
      }
    ]
  },
  walkSpeed: {
    label: "Demo: not everything is translated."
  }
};

/**
 * Describes args passed to stories.
 */
interface StoryArgs {
  locale?: string;
  useStyle?: boolean;
}

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
        args.locale === "en-US"
          ? null // use built-in text for English
          : frenchQueryParamMessages
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
