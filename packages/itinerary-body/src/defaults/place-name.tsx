import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { PlaceNameProps } from "../types";
import { defaultMessages } from "../util";

import BasicPlaceName from "./basic-place-name";

export default function PlaceName({
  config,
  interline,
  place
}: PlaceNameProps): ReactElement {
  return (
    <>
      <BasicPlaceName config={config} interline={interline} place={place} />

      {/* TODO: take another pass on this when working the Transit Leg */}
      {/* Place subheading: Transit stop */}
      {place.stopId && !interline && (
        <S.StopIdSpan>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.TransitLegBody.stopIdBasic"]}
            description="Displays a stop id"
            id="otpUi.TransitLegBody.stopIdBasic"
            values={{
              stopId: place.stopId.split(":")[1]
            }}
          />
        </S.StopIdSpan>
        /*
          TODO: There is no explicit stop button on the mocks.
          Have a question out to marketing as to whether the above StopID
          is a button to navigate the user to the arrival list for the stop
          that's what the button below does
        */
        /* <ViewStopButton stopId={place.stopId} /> */
      )}
    </>
  );
}
