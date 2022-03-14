// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import coreUtils from "@opentripplanner/core-utils";
import { Leg } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

import ViewStopButton from "./view-stop-button";

interface Props {
  leg: Leg;
  onStopClick: ({ stopId: string }) => void;
}

export default function TransitLegSubheader({
  leg,
  onStopClick
}: Props): ReactElement {
  const { from } = leg;
  const isFlex = coreUtils.itinerary.isFlex(leg);
  return (
    <S.PlaceSubheader>
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.TransitLegBody.stopId"]}
        description="Displays the stop ID"
        id="otpUi.TransitLegBody.stopId"
        values={{
          stopId: from.stopId.split(":")[1]
        }}
      />
      {!isFlex && (
        <ViewStopButton onStopClick={onStopClick} stopId={from.stopId} />
      )}
    </S.PlaceSubheader>
  );
}
