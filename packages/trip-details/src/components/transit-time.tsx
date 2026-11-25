import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Clock } from "@styled-icons/fa-solid/Clock";
import { Leg } from "@opentripplanner/types";
import flatten from "flat";
import TripDetail from "../trip-detail";
import { boldText } from "../utils";

import defaultEnglishMessages from "../../i18n/en-US.yml";

const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

/** Time on board transit vehicles, excluding transfer activity and waiting. */
export default function TransitTime({
  legs
}: {
  legs: Leg[];
}): ReactElement | null {
  const transitLegs = legs.filter(leg => leg.transitLeg);
  if (transitLegs.length === 0) return null;

  const minutes = Math.round(
    transitLegs.reduce((seconds, leg) => seconds + leg.duration, 0) / 60
  );

  return (
    <TripDetail
      className="transit-time"
      icon={<Clock size={17} />}
      summary={
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TripDetails.transitTime"]}
          description="Time spent on board transit vehicles, excluding transfers and waiting."
          id="otpUi.TripDetails.transitTime"
          values={{ minutes, strong: boldText }}
        />
      }
    />
  );
}
