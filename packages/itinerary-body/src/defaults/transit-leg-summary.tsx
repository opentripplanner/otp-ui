// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { TransitLegSummaryProps } from "../types";
import { defaultMessages } from "../util";

/**
 * This is a clickable component that summarizes the leg (travel time, stops
 * passed). On click it will expand and show the list of intermediate stops.
 */
export default function TransitLegSummary({
  leg,
  onClick,
  stopsExpanded
}: TransitLegSummaryProps): ReactElement {
  return (
    <S.TransitLegSummary onClick={onClick}>
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitLegBody.rideDurationAndStops"]
        }
        description="Describes ride duration and number of stops"
        id="otpUi.TransitLegBody.rideDurationAndStops"
        values={{
          duration: (
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.ItineraryBody.common.durationShort"]
              }
              description="Duration in abbreviated hours (if over one hour) and minutes"
              id="otpUi.ItineraryBody.common.durationShort"
              values={coreUtils.time.toHoursMinutesSeconds(leg.duration)}
            />
          ),
          numStops: (leg.intermediateStops?.length || 0) + 1
        }}
      />
      {leg.intermediateStops && (
        <>
          {" "}
          <S.CaretToggle expanded={stopsExpanded} />
        </>
      )}
    </S.TransitLegSummary>
  );
}
