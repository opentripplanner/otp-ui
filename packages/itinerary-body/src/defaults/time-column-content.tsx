import React, { ReactElement } from "react";
import { FormattedMessage, FormattedTime } from "react-intl";

import { TimeColumnContentProps } from "../types";

import * as S from "../styled";
import { defaultMessages } from "../util";

/**
 * This is the default component for displaying the time with the specified format
 * of the given leg in the time column of the ItineraryBody -> PlaceRow component.
 */
export default function TimeColumnContent({
  isDestination,
  leg
}: TimeColumnContentProps): ReactElement {
  const time = isDestination ? leg.endTime : leg.startTime;
  return (
    time && (
      <>
        {!isDestination && (
          <S.InvisibleAdditionalDetails>
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.TransitLegBody.departAt"]}
              description="Introduces the departure time to screenreaders"
              id="otpUi.TransitLegBody.departAt"
            />
          </S.InvisibleAdditionalDetails>
        )}
        <FormattedTime value={time} />
      </>
    )
  );
}
