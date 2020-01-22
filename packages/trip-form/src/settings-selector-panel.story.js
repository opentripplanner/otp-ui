import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import SettingsSelectorPanel from "./SettingsSelectorPanel";
import commonModes from "./__mocks__/modes";
import commonCompanies from "./__mocks__/companies";
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
