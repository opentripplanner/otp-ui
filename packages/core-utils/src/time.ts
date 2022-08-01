import { Config } from "@opentripplanner/types";
import { startOfDay, add, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

// Date/time formats (per date-fns) when sending/receiving date from OTP
// regardless of whatever the user has configured as the display format.
export const OTP_API_DATE_FORMAT = "yyyy-MM-dd";
export const OTP_API_TIME_FORMAT = "HH:mm";

/**
 * Breaks up a duration in seconds into hours, minutes, and seconds.
 * @param {number} seconds The number of seconds to break up
 * @returns an object with fields with the corresponding, hours, minutes, seconds.
 */
export function toHoursMinutesSeconds(
  seconds: number
): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60
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
  return format(utcToZonedTime(Date.now(), timezone), OTP_API_DATE_FORMAT);
}
