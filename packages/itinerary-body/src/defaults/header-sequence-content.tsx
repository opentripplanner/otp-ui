import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";

import * as S from "../styled";
import { HeaderSequenceContentProps } from "../types";
import { defaultMessages } from "../util";

/**
 * This is the default component for displaying the header sequence
 * (leg number. agency/mode) at the top of each leg in the ItineraryBody -> PlaceRow component.
 */
export default function HeaderSequenceContent({
  config,
  headingLevel = "h3",
  isDestination,
  leg,
  legIndex
}: HeaderSequenceContentProps): ReactElement {
  const intl = useIntl();

  if (isDestination) return null;

  const transitOperator = leg.transitLeg
    ? coreUtils.route.getTransitOperatorFromLeg(leg, config.transitOperators)
    : null;
  const agencyName = transitOperator?.name || "";

  const headerText = leg.transitLeg
    ? intl.formatMessage(
        {
          defaultMessage:
            defaultMessages["otpUi.ItineraryBody.legSequenceTransit"],
          description: "Leg sequence header for transit legs",
          id: "otpUi.ItineraryBody.legSequenceTransit"
        },
        {
          sequence: legIndex + 1,
          agency: agencyName
        }
      )
    : intl.formatMessage(
        {
          defaultMessage:
            defaultMessages["otpUi.ItineraryBody.legSequenceWalk"],
          description: "Leg sequence header for walk legs",
          id: "otpUi.ItineraryBody.legSequenceWalk"
        },
        { sequence: legIndex + 1 }
      );

  return (
    <S.PlaceSequenceHeader as={headingLevel}>
      {headerText}
    </S.PlaceSequenceHeader>
  );
}
