import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Heartbeat } from "@styled-icons/fa-solid/Heartbeat";
import { Itinerary } from "@opentripplanner/types";
import flatten from "flat";
import TripDetail from "../trip-detail";
import { boldText } from "../utils";
import { TimeActiveDetailsProps } from "../types";

// Load the default messages.
import defaultEnglishMessages from "../../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

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
