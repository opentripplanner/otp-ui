import { Place } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import { defaultMessages } from "../util";

interface Props {
  place: Place;
}

/**
 * Format text bold (used with FormattedMessage).
 */
// TODO: Find a better place for this utility.
function boldText(contents: ReactElement): ReactElement {
  return <strong>{contents}</strong>;
}

/**
 * Renders a "Stay on board at <station>" step in an interlined itinerary.
 */
export default function StayOnBoard({ place }: Props): ReactElement {
  return (
    <FormattedMessage
      defaultMessage={defaultMessages["otpUi.ItineraryBody.stayOnBoard"]}
      description="Instructs riders to stay on board"
      id="otpUi.ItineraryBody.stayOnBoard"
      values={{
        placeName: place.name,
        strong: boldText
      }}
    />
  );
}
