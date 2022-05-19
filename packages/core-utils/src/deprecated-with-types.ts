/* eslint-disable import/no-cycle */
import { TimeOptions } from "@opentripplanner/types";
import { format } from "date-fns";

import { logDeprecationWarning } from "./deprecated";
import {
  formatDurationLikeMoment,
  offsetTime,
  OTP_API_TIME_FORMAT
} from "./time";

// time.ts

/**
 * Formats a time value for display in narrative
 * TODO: internationalization/timezone
 * @param {number} ms epoch time value in milliseconds
 * @returns {string} formatted text representation
 */
export function formatTime(ms: number, options: TimeOptions): string {
  logDeprecationWarning("formatTime", "formatjs");

  return format(
    offsetTime(ms, options),
    options?.format || OTP_API_TIME_FORMAT
  );
}

/**
 * Formats an elapsed time duration for display in narrative.
 * TODO: internationalization
 * @param {number} seconds duration in seconds
 * @returns {string} formatted text representation
 */
// TS TODO: region as type?
export function formatDuration(seconds: number, region: string): string {
  logDeprecationWarning("formatDuration", "formatjs");

  return formatDurationLikeMoment(seconds, false, {
    enabled: true,
    code: region
  });
}

/**
 * Formats an elapsed time in seconds, minutes, hours duration for display in narrative
 * @param {number} seconds duration in seconds
 * @param {object} region  an object that allows internationalization of the time
 * @returns {string}       formatted text representation
 */
// TS TODO: region as type?
export function formatDurationWithSeconds(
  seconds: number,
  region: string
): string {
  logDeprecationWarning("formatDurationWithSeconds", "formatjs");

  return formatDurationLikeMoment(seconds, true, {
    enabled: true,
    code: region
  });
}
