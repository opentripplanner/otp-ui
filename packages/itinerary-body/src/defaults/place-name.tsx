// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import { Config, Place } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
  config: Config;
  interline?: boolean;
  place: Place;
}

/**
 * Format text bold (used with FormattedMessage).
 */
// TODO: Find a better place for this utility.
function boldText(contents: ReactElement): ReactElement {
  return <strong>{contents}</strong>;
}

export default function PlaceName({
  config,
  interline,
  place
}: Props): ReactElement {
  return (
    <>
      {interline ? (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.ItineraryBody.stayOnBoard"]}
          description="Instructs riders to stay on board"
          id="otpUi.ItineraryBody.stayOnBoard"
          values={{
            placeName: place.name,
            strong: boldText
          }}
        />
      ) : (
        <>{coreUtils.itinerary.getPlaceName(place, config.companies)}</>
      )}
      {/* TODO: take another pass on this when working the Transit Leg */}
      {/* Place subheading: Transit stop */}
      {place.stopId && !interline && (
        <S.StopIdSpan>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.ItineraryBody.stopIdBasic"]}
            description="Displays a stop id"
            id="otpUi.ItineraryBody.stopIdBasic"
            values={{
              id: place.stopId.split(":")[1]
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
