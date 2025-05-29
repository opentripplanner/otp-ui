import CSS from "csstype";
import { format, parse } from "date-fns";
import coreUtils from "@opentripplanner/core-utils";
import React, { ChangeEvent, ReactElement, useCallback } from "react";
import { IntlShape, useIntl } from "react-intl";

import colors, { Dropdown } from "@opentripplanner/building-blocks";
import * as S from "../styled";

// eslint-disable-next-line prettier/prettier
import type { QueryParamChangeEvent } from "../types";


const {
  getCurrentDate,
  getCurrentTime,
  getUserTimezone,
  OTP_API_DATE_FORMAT,
  OTP_API_TIME_FORMAT
} = coreUtils.time;

const { grey } = colors

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
   * If true, only render the date/time inputs. The depart/arrive selector will be handled by the parent component.
   */
  departArriveDropdown?: boolean;
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
  text: string;
  type: DepartArriveValue;
}

/**
 * Determines whether the browser supports a particular <input type=<type> /> control,
 * so we can take advantage of native controls
 * (especially date/time selection) on modern (mobile) browsers.
 * @param {*} type One of the HTML5 input types.
 */
function isInputTypeSupported(type: string): boolean {
  // SSR: use of 'document' variable is only valid in a browser (not server-side)
  if (typeof document === "undefined") return false;

  const input = document.createElement("input");
  input.setAttribute("type", type);
  return input.type === type;
}

const supportsDateTimeInputs = isInputTypeSupported("date") && isInputTypeSupported("time");

const buttonStyle = { backgroundColor: "transparent", border: "0px", color: "inherit" }

/**
 * Reference date for parsing.
 */
const referenceDate = new Date();

const departureOptions = (intl: IntlShape): DepartArriveOption[] => [
  {
    // Default option.
    type: "NOW",
    text: intl.formatMessage({ id: "otpUi.DateTimeSelector.now" })
  },
  {
    type: "DEPART",
    text: intl.formatMessage({ id: "otpUi.DateTimeSelector.depart" })
  },
  {
    type: "ARRIVE",
    text: intl.formatMessage({ id: "otpUi.DateTimeSelector.arrive" })
  }
];

export const DepartArriveDropdown = ({ departArrive, timeZone, onQueryParamChange }: {
  departArrive: DepartArriveValue,
  timeZone: string,
  onQueryParamChange: (e: QueryParamChangeEvent) => void
}): JSX.Element => {

  const intl = useIntl()

  const setDepartArrive = (option: DepartArriveOption ) => useCallback(
    () => {
      if (option.type === "NOW") {
        onQueryParamChange({
          date: getCurrentDate(timeZone),
          departArrive: "NOW",
          time: getCurrentTime(timeZone)
        });
      } else {
        onQueryParamChange({
          departArrive: option.type
        });
      }
    },
    [onQueryParamChange, option.type, timeZone]
  );
  return (
    <S.DepartArriveContainer>
      <Dropdown alignMenuLeft id="date-time-depart-arrive" text={departureOptions(intl).find(opt => opt.type === departArrive).text} buttonStyle={buttonStyle}>
        {departureOptions(intl).map(opt => (
          <button
            aria-pressed={opt.type === departArrive}
            key={opt.type}
            onClick={setDepartArrive(opt)}
            type="button"
          >
            {opt.text}
          </button>))}
        </Dropdown>
    </S.DepartArriveContainer>
      
      )
}

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
  departArriveDropdown = false,
  forceLegacy = false,
  onQueryParamChange = null,
  style = null,
  time = null,
  timeFormatLegacy = OTP_API_TIME_FORMAT,
  timeZone = getUserTimezone()
}: DateTimeSelectorProps): ReactElement {
  const intl = useIntl()

  const handleInputChange = (key: string) => useCallback(
    (evt: ChangeEvent<HTMLInputElement>): void => {
      onQueryParamChange({ [key]: evt.target.value });
      // If the user changes the time, it doesn't make sense for them to be departing now.
      if (departArrive === "NOW") {
        onQueryParamChange({ departArrive: "DEPART" });
      }
    },
    [onQueryParamChange, key, departArrive]
  );

  const handleDateChange = handleInputChange("date");

  const handleTimeChange = handleInputChange("time");

  const handleTimeChangeLegacy = useCallback(
    (evt: ChangeEvent<HTMLInputElement>): void => {
      const newTime = format(parse(evt.target.value, timeFormatLegacy, referenceDate), OTP_API_TIME_FORMAT);
      onQueryParamChange({ newTime });
    },
    [onQueryParamChange]
  );

  const handleDateChangeLegacy = useCallback(
    (evt: ChangeEvent<HTMLInputElement>): void => {
      const newDate = format(parse(evt.target.value, dateFormatLegacy, referenceDate), OTP_API_DATE_FORMAT);
      onQueryParamChange({ newDate });
    },
    [onQueryParamChange]
  );



  const isLegacy = forceLegacy || !supportsDateTimeInputs;

  const baseColor = S.baseColor() || grey[900]

  return (
    <S.DateTimeSelector
      aria-label={intl.formatMessage({ id: "otpUi.DateTimeSelector.dateTimeSelector" })}
      baseColor={baseColor}
      className={className}
      role="group"
      style={style}
    >
          {departArriveDropdown && 
            <DepartArriveDropdown 
              departArrive={departArrive} 
              timeZone={timeZone} 
              onQueryParamChange={onQueryParamChange} 
          />}
          {/* The <div> elements below are used for layout, see S.DateTimeSelector. */}
          

      {/* Backup controls (for older browsers) */}
      {isLegacy ?  (
        <>
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
        </>
      ) : 
      ( 
      <>
        <div>
          <input
            aria-label={intl.formatMessage({ id: "otpUi.DateTimeSelector.time" })}
            onChange={handleTimeChange}
            required
            type="time"
            value={time}
            />
        </div>
        <div>
          <input
            aria-label={intl.formatMessage({ id: "otpUi.DateTimeSelector.date" })}
            onChange={handleDateChange}
            required
            type="date"
            value={date}
          />
        </div>
      </>)}
    </S.DateTimeSelector>
  );
}