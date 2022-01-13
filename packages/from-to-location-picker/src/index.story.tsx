import React from "react";
import { IntlProvider } from "react-intl";
import { action } from "@storybook/addon-actions";

import FromToLocationPicker from ".";

import "../__mocks__/trimet-mock.css";

export default {
  title: "From-To-Picker",
  component: FromToLocationPicker
};

const onFromClick = action("onFromClick");
const onToClick = action("onToClick");

export const fromTo = (): React.ReactElement => (
  <IntlProvider locale="en-US">
    <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
  </IntlProvider>
);

export const smallTextSansSerif = (): React.ReactElement => (
  <IntlProvider locale="en-US">
    <span style={{ fontSize: "75%", fontFamily: "sans-serif" }}>
      Plan a trip:
      <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
    </span>
  </IntlProvider>
);

export const otpAmbientStyle = (): React.ReactElement => (
  <IntlProvider
    locale="en-US"
    messages={{
      "otpUi.FromToLocationPicker.from": "Start here",
      "otpUi.FromToLocationPicker.to": "Go here"
    }}
  >
    <div className="trimet-ambient">
      <FromToLocationPicker
        showIcons={false}
        onFromClick={onFromClick}
        onToClick={onToClick}
      />
    </div>
  </IntlProvider>
);
