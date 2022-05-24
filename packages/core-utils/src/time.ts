import { Config } from "@opentripplanner/types";
import {
  startOfDay,
  add,
  format,
  formatDuration as dateFnsFormatDuration
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

/* eslint-disable import/no-cycle */
import {
  formatTime,
  formatDurationWithSeconds,
  formatDuration
} from "./deprecated-with-types";

export { formatTime, formatDuration, formatDurationWithSeconds };

// special constants for making sure the following date format is always sent to
// OTP regardless of whatever the user has configured as the display format
export const OTP_API_DATE_FORMAT = "YYYY-MM-DD";
// Date-Fns uses a different string format than moment.js
// see https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
export const OTP_API_DATE_FORMAT_DATE_FNS = "yyyy-MM-dd";
export const OTP_API_TIME_FORMAT = "HH:mm";

/**
 * To ease the transition away from moment.js, this method uses date-fns to format durations
 * the way moment.js did.
 * @param {number}  seconds     The number of seconds to format
 * @param {boolean} showSeconds Whether to render seconds or not
 * @param {boolean} localize    If true, will create output like moment.js using date-fns locale.
 * Otherwise, uses date-fns default
 * @returns                   Formatted duration
 */
export function formatDurationLikeMoment(
  seconds: number,
  showSeconds: boolean,
  localize: { enabled: boolean; code: string } = {
    enabled: true,
    code: "en-US"
  }
): string {
  // date-fns doesn't do this automatically
  if ((!showSeconds && seconds < 60) || seconds === 0) {
    return "0 min";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secondsLeftOver = showSeconds
    ? seconds - hours * 3600 - minutes * 60
    : 0;
  const specLookup = {
    xHours: "hr",
    xMinutes: "min",
    xSeconds: "sec"
  };
  const locale = localize
    ? {
        // Maintain backwards compatibility when called with localize=true
        code: localize?.code || "en-US",
        formatDistance: (spec, val) => {
          return `${val} ${specLookup[spec]}`;
        }
      }
    : undefined;

  return dateFnsFormatDuration(
    {
      hours,
      minutes,
      seconds: secondsLeftOver
    },
    {
      format: ["hours", "minutes", "seconds"],
      locale
    }
  );
}

/**
 * Breaks up a duration in seconds into hours, minutes, and seconds.
 * @param {number} seconds The number of seconds to break up
 * @returns an object with fields with the corresponding, hours, minutes, seconds.
 */
export function toHoursMinutesSeconds(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  return {
    hours,
    minutes,
    seconds: seconds - hours * 3600 - minutes * 60
  };
}

/**
 * @param  {[type]} config the OTP config object found in store
 * @return {string}        the config-defined time formatter or HH:mm (24-hr time)
 */
export function getTimeFormat(config: Config): string {
  return config?.dateTime?.timeFormat || OTP_API_TIME_FORMAT;
}

export function getDateFormat(config: Config): string {
  return config?.dateTime?.dateFormat || OTP_API_DATE_FORMAT;
}

export function getLongDateFormat(config: Config): string {
  return config?.dateTime?.longDateFormat || "D MMMM YYYY";
}
/**
 * Offsets a time according to the provided time options
 * and returns the result.
 */
export function offsetTime(ms, options) {
  return ms + (options?.offset || 0);
}

/**
 * Formats a seconds after midnight value for display in narrative
 * @param  {number} seconds  time since midnight in seconds
 * @param  {string} timeFormat  A valid date-fns time format
 * @return {string}                   formatted text representation
 */
export function formatSecondsAfterMidnight(
  seconds: number,
  timeFormat: string
): string {
  const time = add(startOfDay(new Date()), { seconds });
  return format(time, timeFormat);
}

/**
 * Uses Intl.DateTimeFormat() api to get the user's time zone. In a test
 * environment, pulls timezone information from an env variable. Default to
 * GMT+0 if the Intl API is unavailable.
 */
export function getUserTimezone(fallbackTimezone = "Etc/Greenwich"): string {
  if (process.env.NODE_ENV === "test") return process.env.TZ;
  return Intl?.DateTimeFormat().resolvedOptions().timeZone || fallbackTimezone;
}

/**
 * Formats current time for use in OTP query
 * The conversion to the user's timezone is needed for testing purposes.
 */
export function getCurrentTime(timezone = getUserTimezone()): string {
  return format(utcToZonedTime(Date.now(), timezone), OTP_API_TIME_FORMAT);
}

/**
 * Formats current date for use in OTP query
 * The conversion to the user's timezone is needed for testing purposes.
 */
export function getCurrentDate(timezone = getUserTimezone()): string {
  return format(
    utcToZonedTime(Date.now(), timezone),
    OTP_API_DATE_FORMAT_DATE_FNS
  );
}
