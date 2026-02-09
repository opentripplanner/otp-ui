import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";

import { HeaderSequenceContentProps } from "../types";

/**
 * This is the default component for displaying the header sequence
 * (leg number. agency/mode) at the top of each leg in the ItineraryBody -> PlaceRow component.
 */
export default function HeaderSequenceContent({
  config,
  isDestination,
  leg,
  legIndex
}: HeaderSequenceContentProps): ReactElement {
  if (isDestination) return null;

  const transitOperator = leg.transitLeg
    ? coreUtils.route.getTransitOperatorFromLeg(leg, config.transitOperators)
    : null;
  const agencyName = transitOperator?.name || "";

  return (
    <h3 style={{ fontWeight: "bold", marginBottom: "8px", margin: 0 }}>
      {leg.transitLeg
        ? `${legIndex + 1}. ${agencyName}`
        : `${legIndex + 1}. Walk`}
    </h3>
  );
}
