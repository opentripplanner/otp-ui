import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import coreUtils from "@opentripplanner/core-utils";
import * as S from "../styled";
import { TransitLegSummaryProps } from "../types";
import { defaultMessages } from "../util";
import Duration from "./duration";

const { ensureAtLeastOneMinute } = coreUtils.time;

/**
 * This is a clickable component that summarizes the leg (travel time, stops
 * passed). On click it will expand and show the list of intermediate stops.
 */
export default function TransitLegSummary({
  leg,
  onClick,
  stopsExpanded
}: TransitLegSummaryProps): ReactElement {
  const durationSeconds = ensureAtLeastOneMinute(leg.duration);

  return (
    <S.TransitLegSummary onClick={onClick}>
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitLegBody.rideDurationAndStops"]
        }
        description="Describes ride duration and number of stops"
        id="otpUi.TransitLegBody.rideDurationAndStops"
        values={{
          duration: <Duration seconds={durationSeconds} />,
          numStops: (leg.intermediateStops?.length || 0) + 1
        }}
      />
      {leg.intermediateStops && <S.CaretToggle expanded={stopsExpanded} />}
      <S.InvisibleAdditionalDetails>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TransitLegBody.expandDetails"]}
          description="Screen reader text to expand stops"
          id="otpUi.TransitLegBody.expandDetails"
        />
      </S.InvisibleAdditionalDetails>
    </S.TransitLegSummary>
  );
}
