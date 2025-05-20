import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Heartbeat } from "@styled-icons/fa-solid/Heartbeat";
import { Itinerary } from "@opentripplanner/types";
import TripDetail from "../trip-detail";
import { defaultMessages } from "../i18n/en-US.yml";
import { boldText } from "../utils";
import { TimeActiveDetailsProps } from "../types";

/**
 * Default rendering if no component is provided for the TimeActiveDetails
 * slot in the TripDetails component.
 */
export function DefaultTimeActiveDetails({
  bikeMinutes,
  walkMinutes
}: TimeActiveDetailsProps): ReactElement {
  return (
    <FormattedMessage
      defaultMessage={
        defaultMessages["otpUi.TripDetails.timeActiveDescription"]
      }
      description="Text describing the walking and biking durations of a trip."
      id="otpUi.TripDetails.timeActiveDescription"
      values={{
        bikeMinutes,
        strong: boldText,
        walkMinutes
      }}
    />
  );
}

export default function TimeActive({
  itinerary,
  TimeActiveDetails,
  showApproximateMinutesActive
}: {
  itinerary: Itinerary;
  TimeActiveDetails: React.ComponentType<TimeActiveDetailsProps>;
  showApproximateMinutesActive: boolean;
}): JSX.Element | null {
  let walkDurationSeconds = 0;
  let bikeDurationSeconds = 0;
  itinerary.legs.forEach(leg => {
    if (leg.mode.startsWith("WALK")) walkDurationSeconds += leg.duration;
    if (leg.mode.startsWith("BICYCLE")) bikeDurationSeconds += leg.duration;
  });
  const bikeMinutes = Math.round(bikeDurationSeconds / 60);
  const walkMinutes = Math.round(walkDurationSeconds / 60);
  const minutesActive = bikeMinutes + walkMinutes;

  if (minutesActive <= 0) return null;

  return (
    <TripDetail
      className="time-active"
      icon={<Heartbeat size={17} />}
      summary={
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TripDetails.minutesActive"]}
          description="Text showing the number of minutes spent walking or biking throughout trip."
          id="otpUi.TripDetails.minutesActive"
          values={{
            approximatePrefix: showApproximateMinutesActive,
            minutes: minutesActive,
            strong: boldText
          }}
        />
      }
      description={
        TimeActiveDetails && (
          <TimeActiveDetails
            bikeMinutes={bikeMinutes}
            walkMinutes={walkMinutes}
          />
        )
      }
    />
  );
}
