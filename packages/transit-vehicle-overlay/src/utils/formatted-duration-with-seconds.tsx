import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import { FormattedMessage } from "react-intl";

import defaultMessages from "./default-messages";

/**
 * Formats hours/minutes/seconds.
 */
export default function FormattedDurationWithSeconds({
  seconds
}: {
  seconds: number;
}): React.ReactElement {
  return (
    <FormattedMessage
      defaultMessage={
        defaultMessages["otpUi.TransitVehicleOverlay.durationWithSeconds"]
      }
      description="Formats a duration in hours, minutes, and seconds"
      id="otpUi.TransitVehicleOverlay.durationWithSeconds"
      values={coreUtils.time.toHoursMinutesSeconds(seconds)}
    />
  );
}
