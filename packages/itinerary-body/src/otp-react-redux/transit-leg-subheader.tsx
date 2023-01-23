import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { TransitLegSubheaderProps } from "../types";
import { defaultMessages } from "../util";

import ViewStopButton from "./view-stop-button";

const { getDisplayedStopId, isFlex } = coreUtils.itinerary;

export default function TransitLegSubheader({
  leg,
  onStopClick
}: TransitLegSubheaderProps): ReactElement {
  const { from } = leg;
  return (
    <S.PlaceSubheader>
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.TransitLegBody.stopId"]}
        description="Displays the stop ID"
        id="otpUi.TransitLegBody.stopId"
        values={{
          stopId: getDisplayedStopId(from)
        }}
      />
      {!isFlex(leg) && (
        <ViewStopButton onStopClick={onStopClick} stopId={from.stopId} />
      )}
    </S.PlaceSubheader>
  );
}
