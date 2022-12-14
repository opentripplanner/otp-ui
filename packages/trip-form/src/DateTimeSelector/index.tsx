import CSS from "csstype";
import { format, parse } from "date-fns";
import flatten from "flat";
import coreUtils from "@opentripplanner/core-utils";
import React, { ChangeEvent, ReactElement, ReactNode, useCallback } from "react";
import { FormattedMessage } from "react-intl";

import ModeButton from "../ModeButton";
import * as S from "../styled";

// eslint-disable-next-line prettier/prettier
import type { QueryParamChangeEvent } from "../types";

// Load the default messages.
import defaultEnglishMessages from "../../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

const {
  getCurrentDate,
  getCurrentTime,
  getUserTimezone,
  OTP_API_DATE_FORMAT,
  OTP_API_TIME_FORMAT
} = coreUtils.time;

type DepartArriveValue = "NOW" | "DEPART" | "ARRIVE";

interface DateTimeSelectorProps {
  /**
   * The CSS class name(s) to apply to this element.
   */
  className?: string;
  /**
   * The initial departure/arrival date string, in a format that an HTML <input type="date"> control can render.
   */
  date?: string;
  /**
   * The date format string for legacy mode (on legacy browsers, or if `forceLegacy` is true).
   */
  dateFormatLegacy?: string;
  /**
   * The initial setting determining whether a trip should start or end at a given time.
   */
  departArrive?: DepartArriveValue;
  /**
   * If true, forces legacy mode and uses `<input type="text">`
   * instead of the native date/time pickers found on modern browsers.
   */
  forceLegacy?: boolean;
  /**
   * Triggered when a query parameter is changed.
   * @param params A { param1: value1, param2, value2, ... } object that contains the new values for the parameter(s) that has (have) changed.
   */
  onQueryParamChange: (e: QueryParamChangeEvent) => void; // FIXME: add types, see interface TransitFareData.
  /**
   * Standard React inline style prop.
   */
  style?: CSS.Properties;
  /**
   * The initial departure/arrival time string, in a format that an HTML <input type="time"> control can render.
   */
  time?: string;
  /**
   * The time format string for legacy mode (on legacy browsers, or if `forceLegacy` is true).
   */
  timeFormatLegacy?: string;
  /**
   * An IANA timezone (e.g. "America/Los_Angeles") used to convert the "Leave now" time
   * to the transit agency local time.
   */
  timeZone?: string;
}

interface DepartArriveOption {
  isSelected?: boolean;
  text: ReactNode;
  type: DepartArriveValue;
}

/**
 * Determines whether the browser supports a particular <input type=<type> /> control,
 * so we can take advantage of native controls
 * (especially date/time selection) on modern (mobile) browsers.
 * @param {*} type One of the HTML5 input types.
 */
function isInputTypeSupported(type: string): boolean {
  let retVal = false;
  if (typeof document !== "undefined") {
    const input = document.createElement("input");
    input.setAttribute("type", type);
    retVal = input.type === type;
  }
  return retVal;
}

const supportsDateTimeInputs = isInputTypeSupported("date") && isInputTypeSupported("time");

/**
 * Reference date for parsing.
 */
const referenceDate = new Date();

/**
 * The `DateTimeSelector` component lets the OTP user chose a departure or arrival date/time.
 * (The departure can be right now.)
 *
 * There are two rendering modes, a "normal" mode and a "legacy" mode.
 * - "Normal" mode: We try to use `<input type="time|date">` for date and time input.
 *   On current HTML5 browsers (desktop or mobile), these controls
 *   render the date/time according to OS settings and natively offer a user interface
 *   for choosing the date/time.
 *   Thus, when `<input type="time|date">` is supported, there is no need to specify a date/time format.
 *   If not, we fall back to "legacy" mode.
 * - "Legacy" mode: On Safari for MacOS, and on legacy browsers that don't support `<input type="time|date">`,
 *   `<input type="time|date">` renders as the default `<input type="text">`, and in these conditions,
 *   we have to fall back to formatting the date/time ourselves, using `dateFormatLegacy` and `timeFormatLegacy` props.
 * - Implementers don't know in advance whether the browser supports `<input type="time|date">`.
 *   That determination is performed by method `isInputTypeSupported(type)` above when the constructor is executed.
 *   Therefore, they should provide `dateFormatLegacy` and `timeFormatLegacy` props as a backup.
 *   If these props are not provided, the OTP API date format is used.
 * - For testing purposes, implementers can "force" the "legacy" mode by setting the `forceLegacy` prop to true.
 */
export default function DateTimeSelector({
  className = null,
  date = null,
  dateFormatLegacy = OTP_API_DATE_FORMAT,
  departArrive = "NOW",
  forceLegacy = false,
  onQueryParamChange = null,
  style = null,
  time = null,
  timeFormatLegacy = OTP_API_TIME_FORMAT,
  timeZone = getUserTimezone()
}: DateTimeSelectorProps): ReactElement {
  const handleQueryParamChange = useCallback(
    (queryParam: QueryParamChangeEvent): void => {
      if (typeof onQueryParamChange === "function") {
        onQueryParamChange(queryParam);
      }
    },
    [onQueryParamChange]
  );

  const handleInputChange = (key: string) => useCallback(
    (evt: ChangeEvent<HTMLInputElement>): void => {
      handleQueryParamChange({ [key]: evt.target.value });
    },
    [onQueryParamChange, key]
  );

  const handleDateChange = handleInputChange("date");

  const handleTimeChange = handleInputChange("time");

  const handleTimeChangeLegacy = useCallback(
    (evt: ChangeEvent<HTMLInputElement>): void => {
      const newTime = format(parse(evt.target.value, timeFormatLegacy, referenceDate), OTP_API_TIME_FORMAT);
      handleQueryParamChange({ newTime });
    },
    [onQueryParamChange]
  );

  const handleDateChangeLegacy = useCallback(
    (evt: ChangeEvent<HTMLInputElement>): void => {
      const newDate = format(parse(evt.target.value, dateFormatLegacy, referenceDate), OTP_API_DATE_FORMAT);
      handleQueryParamChange({ newDate });
    },
    [onQueryParamChange]
  );

  const setDepartArrive = (option: DepartArriveOption) => useCallback(
    () => {
      if (option.type === "NOW") {
        handleQueryParamChange({
          date: getCurrentDate(timeZone),
          departArrive: "NOW",
          time: getCurrentTime(timeZone)
        });
      } else if (!option.isSelected) {
        handleQueryParamChange({
          departArrive: option.type
        });
      }
    },
    [onQueryParamChange, option.type, option.isSelected, timeZone]
  );

  const departureOptions: DepartArriveOption[] = [
    {
      // Default option.
      type: "NOW",
      text: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.DateTimeSelector.now"]}
          description="Text indicating that the traveler wants to depart as soon as possible (i.e. 'now')"
          id="otpUi.DateTimeSelector.now"
        />
      )
    },
    {
      type: "DEPART",
      text: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.DateTimeSelector.depart"]}
          description="Text indicating that the traveler wants to depart at a given date/time"
          id="otpUi.DateTimeSelector.depart"
        />
      )
    },
    {
      type: "ARRIVE",
      text: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.DateTimeSelector.arrive"]}
          description="Text indicating that the traveler wants to arrive by a certain date/time"
          id="otpUi.DateTimeSelector.arrive"
        />
      )
    }
  ];
  departureOptions.forEach(opt => {
    opt.isSelected = departArrive === opt.type;
  });

  const isLegacy = forceLegacy || !supportsDateTimeInputs;

  return (
    <S.DateTimeSelector className={className} style={style}>
      <S.DateTimeSelector.DepartureRow>
        {departureOptions.map(opt => (
          <ModeButton
            key={opt.type}
            onClick={setDepartArrive(opt)}
            selected={opt.isSelected}
          >
            {opt.text}
          </ModeButton>
        ))}
      </S.DateTimeSelector.DepartureRow>

      {departArrive !== "NOW" && !isLegacy && (
        <S.DateTimeSelector.DateTimeRow>
          {/* The <div> elements below are used for layout, see S.DateTimeSelector. */}
          <div>
            <input
              onChange={handleTimeChange}
              required
              type="time"
              value={time}
            />
          </div>
          <div>
            <input
              onChange={handleDateChange}
              required
              type="date"
              value={date}
            />
          </div>
        </S.DateTimeSelector.DateTimeRow>
      )}

      {/* Backup controls (for older browsers) */}
      {departArrive !== "NOW" && isLegacy && (
        <S.DateTimeSelector.DateTimeRow>
          <div>
            <input
              defaultValue={format(parse(time, OTP_API_TIME_FORMAT, referenceDate), timeFormatLegacy)}
              onChange={handleTimeChangeLegacy}
              required
              type="text"
            />
          </div>
          <div>
            <input
              defaultValue={format(parse(date, OTP_API_DATE_FORMAT, referenceDate), dateFormatLegacy)}
              onChange={handleDateChangeLegacy}
              required
              type="text"
            />
          </div>
        </S.DateTimeSelector.DateTimeRow>
      )}
    </S.DateTimeSelector>
  );
}
