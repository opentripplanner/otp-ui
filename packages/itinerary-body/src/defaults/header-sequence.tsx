import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { HeaderSequenceProps } from "../types";

/**
 * This is the default component for displaying the header sequence
 * in the ItineraryBody -> PlaceRow component.
 */
export default function HeaderSequence({
  leg,
  legIndex
}: HeaderSequenceProps): ReactElement {
  return (
    <S.HeaderSequenceWrapper>
      {legIndex + 1}.{" "}
      {leg.transitLeg ? (
        <>
          {leg.agencyName} {leg.routeShortName}
        </>
      ) : (
        <FormattedMessage
          id="otpUi.HeaderSequence.walk"
          defaultMessage="Walk"
        />
      )}
    </S.HeaderSequenceWrapper>
  );
}
