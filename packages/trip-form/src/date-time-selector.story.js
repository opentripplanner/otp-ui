import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";

import DateTimeSelector from "./DateTimeSelector";
import trimet from "./__mocks__/trimet.styled";

const onQueryParamChange = action("onQueryParamChange");

export default {
  title: "DateTimeSelector",
  decorators: [withInfo, withKnobs]
};

export const dateTimeSelector = () => {
  return (
    <DateTimeSelector
      departArrive="NOW"
      date="2020-02-15"
      dateFormatLegacy={text("dateFormatLegacy", "YY-M-d")}
      forceLegacy={boolean("forceLegacy", false)}
      time="14:17"
      timeFormatLegacy={text("timeFormatLegacy", "HH:mm")}
      onQueryParamChange={onQueryParamChange}
    />
  );
};
export const dateTimeSelectorStyled = () => trimet(dateTimeSelector());
