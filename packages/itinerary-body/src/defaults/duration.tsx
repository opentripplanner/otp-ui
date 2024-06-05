import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import { defaultMessages } from "../util";

interface Props {
  seconds: number;
  mode?: string;
  showApproximatePrefixNonTransitLegs?: boolean;
}

/**
 * This is a clickable component that summarizes the leg (travel time, stops
 * passed). On click it will expand and show the list of intermediate stops.
 */
export default function Duration({
  seconds,
  mode,
  showApproximatePrefixNonTransitLegs
}: Props): ReactElement {
  const message =
    showApproximatePrefixNonTransitLegs && mode === "WALK"
      ? defaultMessages["otpUi.ItineraryBody.common.durationShortWalk"]
      : defaultMessages["otpUi.ItineraryBody.common.durationShort"];

  return (
    <FormattedMessage
      defaultMessage={message}
      description="Duration in abbreviated hours (if over one hour) and minutes"
      id="otpUi.ItineraryBody.common.durationShort"
      values={coreUtils.time.toHoursMinutesSeconds(seconds)}
    />
  );
}
