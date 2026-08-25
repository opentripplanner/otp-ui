import { Place } from "@opentripplanner/types";
import React, { ReactElement } from "react";

import { useIntl } from "react-intl";
import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
  closedStopIds?: Set<string>;
  stops: Place[];
}

export default function IntermediateStops({
  closedStopIds,
  stops
}: Props): ReactElement {
  // The closed stops are in the format {agencyId}:{stopId}, but the stops that are fed to this
  // component only use the {stopId} portion, so we need to strip off the agencyId prefix and the colon
  const closedStopsNumericCodes = new Set<string>();
  closedStopIds?.forEach(stop => {
    if (!stop.includes(":")) closedStopsNumericCodes.add(stop);
    else {
      const split = stop.split(":");
      if (split.length === 2) closedStopsNumericCodes.add(split[1]);
    }
  });
  const intl = useIntl();
  const closedMessage = intl.formatMessage({
    defaultMessage: defaultMessages["otpUi.TransitLegBody.closed"],
    description: "Denotes a closed stop in the itinerary body",
    id: "otpUi.TransitLegBody.closed"
  });
  return (
    <S.IntermediateStops>
      {stops.map((stop, k) => {
        const closed = closedStopsNumericCodes.has(stop.stopCode ?? "");
        return (
          <S.StopRow key={k}>
            <S.StopMarker>&bull;</S.StopMarker>
            <S.StopName closed={closed}>
              {`${stop.name}${closed ? ` (${closedMessage})` : ""}`}
            </S.StopName>
          </S.StopRow>
        );
      })}
    </S.IntermediateStops>
  );
}
