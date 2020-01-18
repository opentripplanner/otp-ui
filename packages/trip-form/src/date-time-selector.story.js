import React from "react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { withKnobs, boolean, date, select } from "@storybook/addon-knobs";
import moment from "moment";
import {
  OTP_API_DATE_FORMAT,
  OTP_API_TIME_FORMAT
} from "@opentripplanner/core-utils/lib/time";

import DateTimeSelector from "./DateTimeSelector";

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

const options = {
  NOW: "NOW",
  DEPART: "DEPART",
  ARRIVE: "ARRIVE"
};

export const dateTimeSelector = () => {
  const dateTime = new Date(date("Date & Time", new Date("2020-02-15")));
  const dateOnly = moment(dateTime).format(OTP_API_DATE_FORMAT);
  const time = moment(dateTime).format(OTP_API_TIME_FORMAT);

  return (
    <DateTimeSelector
      departArrive={select("departArrive", options, "NOW")}
      date={dateOnly}
      forceLegacy={boolean("forceLegacy", false)}
      time={time}
      onQueryParamChange={onQueryParamChange}
    />
  );
};
