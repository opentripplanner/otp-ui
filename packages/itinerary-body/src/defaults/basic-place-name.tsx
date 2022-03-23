import React, { ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PlaceNameProps } from "../types";
import { defaultMessages, getPlaceName } from "../util";

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
}: PlaceNameProps): ReactElement {
  const intl = useIntl();
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
        <>{getPlaceName(place, config.companies, intl)}</>
      )}
    </>
  );
}
