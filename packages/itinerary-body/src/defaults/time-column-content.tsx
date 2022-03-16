import React, { ReactElement } from "react";
import { FormattedTime } from "react-intl";

import { TimeColumnContentProps } from "../types";

/**
 * This is the default component for displaying the time with the specified format
 * of the given leg in the time column of the ItineraryBody -> PlaceRow component.
 */
export default function TimeColumnContent({
  isDestination,
  leg
}: TimeColumnContentProps): ReactElement {
  const time = isDestination ? leg.endTime : leg.startTime;
  return time && <FormattedTime value={time} />;
}
