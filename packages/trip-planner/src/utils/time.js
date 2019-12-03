import moment from "moment";
import "moment-timezone";

// special constants for making sure the following date format is always sent to
// OTP regardless of whatever the user has configured as the display format
export const OTP_API_DATE_FORMAT = "YYYY-MM-DD";
export const OTP_API_TIME_FORMAT = "HH:mm";

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
