import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";

import DateTimeSelector from "./DateTimeSelector";
import * as TriMetStyled from "./__mocks__/trimet.styled";

import "./__mocks__/trimet-mock.css";

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

export default {
  title: "DateTimeSelector",
  decorators: [background, withInfo, withKnobs]
};

const dateTimeSelectorStory = SelectorType => {
  return (
    <SelectorType
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

export const dateTimeSelector = dateTimeSelectorStory(DateTimeSelector);
export const dateTimeSelectorStyled = dateTimeSelectorStory(
  TriMetStyled.DateTimeSelectorControl
);
