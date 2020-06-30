import moment from "moment-timezone";

// special constants for making sure the following date format is always sent to
// OTP regardless of whatever the user has configured as the display format
export const OTP_API_DATE_FORMAT = "YYYY-MM-DD";
export const OTP_API_TIME_FORMAT = "HH:mm";

/**
 * @param  {[type]} config the OTP config object found in store
 * @return {string}        the config-defined time formatter or HH:mm (24-hr time)
 */
export function getTimeFormat(config) {
  return config.dateTime && config.dateTime.timeFormat
    ? config.dateTime.timeFormat
    : OTP_API_TIME_FORMAT;
}

export function getDateFormat(config) {
  return config.dateTime && config.dateTime.dateFormat
    ? config.dateTime.dateFormat
    : OTP_API_DATE_FORMAT;
}

export function getLongDateFormat(config) {
  return config.dateTime && config.dateTime.longDateFormat
    ? config.dateTime.longDateFormat
    : "D MMMM YYYY";
}

/**
 * Formats an elapsed time duration for display in narrative
 * TODO: internationalization
 * @param {number} seconds duration in seconds
 * @returns {string} formatted text representation
 */
export function formatDuration(seconds) {
  const dur = moment.duration(seconds, "seconds");
  let text = "";
  if (dur.hours() > 0) text += `${dur.hours()} hr, `;
  text += `${dur.minutes()} min`;
  return text;
}

/**
 * Formats an elapsed time in seconds, minutes, hours duration for display in narrative
 * TODO: internationalization
 * @param {number} seconds duration in seconds
 * @returns {string} formatted text representation
 */
export function formatDurationWithSeconds(seconds) {
  const dur = moment.duration(seconds, "seconds");
  let text = "";
  if (dur.hours() > 0) text += `${dur.hours()} hr, `;
  if (dur.minutes() > 0) text += `${dur.minutes()} min, `;
  text += `${dur.seconds()} sec`;
  return text;
}

/**
 * Formats a time value for display in narrative
 * TODO: internationalization/timezone
 * @param {number} ms epoch time value in milliseconds
 * @returns {string} formatted text representation
 */
export function formatTime(ms, options) {
  return moment(ms + (options && options.offset ? options.offset : 0)).format(
    options && options.format ? options.format : OTP_API_TIME_FORMAT
  );
}

/**
 * Formats a seconds after midnight value for display in narrative
 * @param  {number} seconds  time since midnight in seconds
 * @param  {string} timeFormat  A valid moment.js time format
 * @return {string}                   formatted text representation
 */
export function formatSecondsAfterMidnight(seconds, timeFormat) {
  return moment()
    .startOf("day")
    .seconds(seconds)
    .format(timeFormat);
}

/**
 * Get the timezone name that is set for the user that is currently looking at
 * this website. Use a bit of hackery to force a specific timezone if in a
 * test environment.
 */
export function getUserTimezone() {
  return process.env.NODE_ENV === "test" ? process.env.TZ : moment.tz.guess();
}

/**
 * Formats current time for use in OTP query
 * The conversion to the user's timezone is needed for testing purposes.
 */
export function getCurrentTime(timezone = getUserTimezone()) {
  return moment()
    .tz(timezone)
    .format(OTP_API_TIME_FORMAT);
}

/**
 * Formats current date for use in OTP query
 * The conversion to the user's timezone is needed for testing purposes.
 */
export function getCurrentDate(timezone = getUserTimezone()) {
  return moment()
    .tz(timezone)
    .format(OTP_API_DATE_FORMAT);
}
