import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import {
  OTP_API_DATE_FORMAT,
  OTP_API_TIME_FORMAT
} from "@opentripplanner/core-utils/lib/time";

import ModeButton from "../ModeButton";
import * as Styled from "../styled";

/**
 * Determines whether the browser supports a particular <input type=<type> /> control,
 * so we can take advantage of native controls
 * (especially date/time selection) on modern (mobile) browsers.
 * @param {*} type One of the HTML5 input types.
 */
function isInputTypeSupported(type) {
  const input = document.createElement("input");
  input.setAttribute("type", type);
  return input.type === type;
}

/**
 * The DateTimeSelector component lets the OTP user chose a departure or arrival date/time.
 * (The departure can be right now.)
 */
class DateTimeSelector extends Component {
  supportsDateTimeInputs =
    isInputTypeSupported("date") && isInputTypeSupported("time");

  constructor(props) {
    super(props);

    const { date, time, departArrive } = props;

    this.state = {
      date,
      time,
      departArrive
    };
  }

  handleDateChange = evt => {
    this.handleQueryParamChange({ date: evt.target.value });
  };

  handleTimeChange = evt => {
    this.handleQueryParamChange({ time: evt.target.value });
  };

  handleTimeTimeChangeLegacy = evt => {
    const { timeFormatLegacy } = this.props;
    const time = moment(evt.target.value, timeFormatLegacy).format(
      OTP_API_TIME_FORMAT
    );
    this.handleQueryParamChange({ time });
  };

  handleDateChangeLegacy = evt => {
    const { dateFormatLegacy } = this.props;
    const date = moment(evt.target.value, dateFormatLegacy).format(
      OTP_API_DATE_FORMAT
    );
    this.handleQueryParamChange({ date });
  };

  setDepartArrive = option => {
    if (option.type === "NOW") {
      this.handleQueryParamChange({
        departArrive: "NOW",
        date: moment().format(OTP_API_DATE_FORMAT),
        time: moment().format(OTP_API_TIME_FORMAT)
      });
    } else if (!option.isSelected) {
      this.handleQueryParamChange({
        departArrive: option.type
        // TODO: add the depart/arrive date and time to the new state.
      });
    }
  };

  raiseOnQueryParamChange = queryParam => {
    const { onQueryParamChange } = this.props;

    if (typeof onQueryParamChange === "function") {
      onQueryParamChange(queryParam);
    }
  };

  handleQueryParamChange = queryParam => {
    this.raiseOnQueryParamChange(queryParam);
    this.setState({ ...queryParam });
  };

  render() {
    // console.log(`supports date time: ${this.supportsDateTimeInputs}`);

    const {
      className,
      dateFormatLegacy = OTP_API_DATE_FORMAT,
      forceLegacy,
      timeFormatLegacy = OTP_API_TIME_FORMAT,
      style
    } = this.props;
    const { departArrive, date, time } = this.state;

    const departureOptions = [
      {
        // Default option.
        type: "NOW",
        text: "Leave now"
      },
      {
        type: "DEPART",
        text: "Depart at"
      },
      {
        type: "ARRIVE",
        text: "Arrive by"
      }
    ];
    departureOptions.forEach(opt => {
      opt.isSelected = departArrive === opt.type;
    });

    const isLegacy = forceLegacy || !this.supportsDateTimeInputs;

    return (
      <div className={className} style={style}>
        <Styled.DepartureRow>
          {departureOptions.map(opt => (
            <ModeButton
              key={opt.type}
              selected={opt.isSelected}
              onClick={() => this.setDepartArrive(opt)}
            >
              {opt.text}
            </ModeButton>
          ))}
        </Styled.DepartureRow>

        {departArrive !== "NOW" && !isLegacy && (
          <Styled.DateTimeRow>
            <div>
              <input
                type="time"
                value={time}
                required
                onChange={this.handleTimeChange}
              />
            </div>
            <div>
              <input
                type="date"
                value={date}
                required
                onChange={this.handleDateChange}
              />
            </div>
          </Styled.DateTimeRow>
        )}

        {/* Backup controls (for older browsers) */}
        {departArrive !== "NOW" && isLegacy && (
          <Styled.DateTimeRow>
            <div>
              <input
                type="text"
                defaultValue={moment(time, OTP_API_TIME_FORMAT).format(
                  timeFormatLegacy
                )}
                required
                onChange={this.handleTimeTimeChangeLegacy}
              />
            </div>
            <div>
              <input
                type="text"
                defaultValue={moment(date, OTP_API_DATE_FORMAT).format(
                  dateFormatLegacy
                )}
                required
                onChange={this.handleDateChangeLegacy}
              />
            </div>
          </Styled.DateTimeRow>
        )}
      </div>
    );
  }
}

DateTimeSelector.propTypes = {
  /**
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  /**
   * The initial departure/arrival date string, in a format that an HTML <input type="date"> control can render.
   */
  date: PropTypes.string,
  /**
   * The date format string for legacy mode.
   */
  dateFormatLegacy: PropTypes.string,
  /**
   * The initial setting determining whether a trip should start or end at a given time.
   */
  departArrive: PropTypes.oneOf(["NOW", "DEPART", "ARRIVE"]),
  /**
   * If true, forces legacy mode and skips native date/time pickers on modern browsers.
   */
  forceLegacy: PropTypes.bool,
  /**
   * The initial departure/arrival time string, in a format that an HTML <input type="time"> control can render.
   */
  time: PropTypes.string,
  /**
   * The time format string for legacy mode.
   */
  timeFormatLegacy: PropTypes.string,
  /**
   * Triggered when a query parameter is changed.
   * @param params A { param1: value1, param2, value2, ... } object that contains the new values for the parameter(s) that has (have) changed.
   */
  onQueryParamChange: PropTypes.func
};

DateTimeSelector.defaultProps = {
  className: null,
  date: null,
  dateFormatLegacy: null,
  departArrive: "NOW",
  forceLegacy: false,
  time: null,
  timeFormatLegacy: null,
  onQueryParamChange: null
};

export default DateTimeSelector;
