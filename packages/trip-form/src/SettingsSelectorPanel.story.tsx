import { ClassicModeIcon } from "@opentripplanner/icons";
import { action } from "@storybook/addon-actions";
import { StoryContext } from "@storybook/react";
import React, { Component, ReactElement } from "react";
import SettingsSelectorPanel from "./SettingsSelectorPanel";

import commonCompanies from "./__mocks__/companies";
import commonModesEmpty from "./__mocks__/modes-empty";
import trimet from "./__mocks__/trimet-styled";

import commonModesEnglish from "./__mocks__/modes-en";
import commonModesFrench from "./__mocks__/modes-fr";

/**
 * Describes args passed to stories.
 */
type StoryArgs = SettingsSelectorPanelProps & {
  useCustomMessages?: boolean;
  useStyle?: boolean;
};

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

const decorator = (
  Story: StoryType,
  context: {
    args: StoryArgs;
  }
): ReactElement => {
  const { args } = context;
  const { useStyle } = args;
  return <div>{useStyle ? trimet(<Story />) : <Story />} </div>;
};

export default {
  args: {
    useCustomMessages: false,
    useStyle: false
  },
  component: SettingsSelectorPanel,
  decorators: [decorator],
  parameters: {
    controls: {
      include: ["useCustomMessages", "useStyle"]
    }
  },
  // Use of 'ṯ' character instead of 't' is intended.
  // Including the word "Setting" in the title breaks storybook's lower pane.
  title: "SeṯtingsSelectorPanel"
};

const SettingsPanelTemplate = (args: StoryArgs, context: StoryContext) => {
  const { globals } = context;
  return (
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
          (globals.locale === "en-US" ? commonModesEnglish : commonModesFrench)
        }
      />
    </PanelWrapper>
  );
};

/**
 * Helper to simplify story declaration.
 */
function makeStory(args: StoryArgs) {
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
