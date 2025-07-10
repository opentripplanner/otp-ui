import React, { ReactElement } from "react";
import { IntlProvider } from "react-intl";
import { action } from "storybook/actions";

import FromToLocationPicker from ".";

import "../__mocks__/trimet-mock.css";

const withIntl = (Story: () => JSX.Element) => (
  <IntlProvider messages={{}} locale="en">
    <Story />
  </IntlProvider>
);

export default {
  title: "From-To-Picker",
  component: FromToLocationPicker,
  decorators: [withIntl]
};

const onFromClick = action("onFromClick");
const onToClick = action("onToClick");

export const fromTo = (): ReactElement => (
  <FromToLocationPicker onFromClick={onFromClick} onToClick={onToClick} />
);

export const smallTextSansSerif = (): ReactElement => (
  <span style={{ fontSize: "75%", fontFamily: "sans-serif" }}>
    <FromToLocationPicker
      label
      onFromClick={onFromClick}
      onToClick={onToClick}
    />
  </span>
);

export const customStyleAndText = (): React.ReactElement => (
  <div className="trimet-ambient">
    <FromToLocationPicker
      label={<i style={{ color: "#ffff00" }}>Your trip:</i>}
      onFromClick={onFromClick}
      onToClick={onToClick}
      showIcons={false}
    />
  </div>
);
