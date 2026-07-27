import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
  href: string;
  instructions?: ReactNode;
  secondaryLink?: ReactNode;
  text?: ReactNode;
}

/**
 * Component that groups links and instructions for booking rides.
 */
export default function BookRide({
  href,
  instructions,
  text // defaults to "Book Ride"
}: Props): ReactElement {
  return (
    <S.BookTNCRideButtonContainer>
      <S.BookTNCRideButton
        href={href}
        target={coreUtils.ui.isMobile() ? "_self" : "_blank"}
      >
        {text || (
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.ItineraryBody.bookRide"]}
            description="Action text to book a ride."
            id="otpUi.ItineraryBody.bookRide"
          />
        )}
      </S.BookTNCRideButton>
      {instructions && (
        <>
          <S.BookLaterPointer />
          <S.BookLaterContainer>
            <S.BookLaterInnerContainer>
              <S.BookLaterText>{instructions}</S.BookLaterText>
            </S.BookLaterInnerContainer>
          </S.BookLaterContainer>
        </>
      )}
    </S.BookTNCRideButtonContainer>
  );
}
