import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { TransitLegSummaryProps } from "../types";
import { defaultMessages, roundDurationToMinute } from "../util";
import Duration from "./duration";

/**
 * This is a clickable component that summarizes the leg (travel time, stops
 * passed). On click it will expand and show the list of intermediate stops.
 */
export default function TransitLegSummary({
  leg,
  onClick,
  stopsExpanded
}: TransitLegSummaryProps): ReactElement {
  const duration = roundDurationToMinute(leg.duration);

  return (
    <S.TransitLegSummary onClick={onClick}>
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitLegBody.rideDurationAndStops"]
        }
        description="Describes ride duration and number of stops"
        id="otpUi.TransitLegBody.rideDurationAndStops"
        values={{
          duration: <Duration seconds={duration} />,
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
