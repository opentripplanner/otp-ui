import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { TransitLegSubheaderProps } from "../types";
import { defaultMessages } from "../util";

import ViewStopButton from "./view-stop-button";

const { getDisplayedStopCode, isFlex } = coreUtils.itinerary;

export default function TransitLegSubheader({
  leg,
  onStopClick
}: TransitLegSubheaderProps): ReactElement {
  const { from } = leg;
  return (
    <S.PlaceSubheader className="transit-leg-subheader">
      {getDisplayedStopCode(from) && (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TransitLegBody.stopId"]}
          description="Displays the stop ID"
          id="otpUi.TransitLegBody.stopId"
          values={{
            stopId: getDisplayedStopCode(from)
          }}
        />
      )}

      {!isFlex(leg) && (
        <ViewStopButton
          onStopClick={onStopClick}
          stop={from.stop}
          stopCode={getDisplayedStopCode(from)}
        />
      )}
    </S.PlaceSubheader>
  );
}
