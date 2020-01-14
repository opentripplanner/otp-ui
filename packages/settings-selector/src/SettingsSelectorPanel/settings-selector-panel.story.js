import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import SettingsSelectorPanel from ".";
import commonModes from "../__mocks__/modes";
import commonCompanies from "../__mocks__/companies";

import "../__mocks__/trimet-mock.css";

const background = story => (
  <div
    style={{
      backgroundColor: "#F0F0F0",
      height: "500px",
      padding: "15px",
      fontFamily: "Hind, sans-serif",
      fontSize: "14px",
      fontWeight: "300"
    }}
  >
    {story()}
  </div>
);

const onQueryParamChange = action("onQueryParamChange");

const queryParams = {
  mode: "WALK",
  routingType: "ITINERARY"
};

export default {
  title: "SettingsSelectorPanel",
  decorators: [background, withInfo]
};

export const container = () => (
  <SettingsSelectorPanel
    queryParams={queryParams}
    supportedModes={commonModes}
    supportedCompanies={commonCompanies}
    onQueryParamChange={onQueryParamChange}
  />
);
