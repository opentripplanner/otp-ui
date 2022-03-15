// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import { Config, Place } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import { defaultMessages } from "../util";

export interface Props {
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

export default function BasicPlaceName({
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
    </>
  );
}
