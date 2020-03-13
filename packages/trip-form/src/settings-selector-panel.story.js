import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import SettingsSelectorPanel from "./SettingsSelectorPanel";

import commonCompanies from "./__mocks__/companies";
import commonModes from "./__mocks__/modes";
import commonModesEmpty from "./__mocks__/modes-empty";
import customIcons from "./__mocks__/custom-icons";
import trimet from "./__mocks__/trimet.styled";

const onQueryParamChange = action("onQueryParamChange");

const queryParams = {
  mode: "WALK",
  routingType: "ITINERARY"
};

export default {
  title: "SettingsSelectorPanel",
  decorators: [withInfo]
};

export const settingsSelectorPanel = () => (
  <SettingsSelectorPanel
    queryParams={queryParams}
    supportedModes={commonModes}
    supportedCompanies={commonCompanies}
    onQueryParamChange={onQueryParamChange}
  />
);
export const settingsSelectorPanelStyled = () =>
  trimet(settingsSelectorPanel());

export const settingsSelectorPanelWithCustomIcons = () => (
  <SettingsSelectorPanel
    icons={customIcons}
    queryParams={queryParams}
    supportedModes={commonModes}
    supportedCompanies={commonCompanies}
    onQueryParamChange={onQueryParamChange}
  />
);

export const settingsSelectorPanelUndefinedParams = () => (
  <SettingsSelectorPanel
    queryParams={queryParams}
    supportedModes={commonModesEmpty}
    supportedCompanies={undefined}
    onQueryParamChange={onQueryParamChange}
  />
);
