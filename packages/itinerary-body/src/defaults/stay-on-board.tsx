import { Place } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import { defaultMessages } from "../util";

interface Props {
  place: Place;
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
        place: <strong>{place.name}</strong>
      }}
    />
  );
}
