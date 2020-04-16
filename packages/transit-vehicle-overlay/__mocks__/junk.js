import { formatDurationWithSeconds } from "@opentripplanner/core-utils/lib/time";

export function makeRandomDate() {
  const secs = Date.now() % 379;
  const prettyDate = formatDurationWithSeconds(secs);
  return prettyDate;
}

export function fulink() {}
