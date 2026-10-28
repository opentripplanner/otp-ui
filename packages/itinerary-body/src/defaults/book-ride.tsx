import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

import ExternalLinkHidden from "./external-link-hidden";

interface Props {
  href: string;
  instructions?: ReactNode;
  text?: ReactNode;
}

/**
 * Component that groups a button-like link and instructions for booking rides.
 */
export default function BookRide({
  href, // url is assumed external
  instructions,
  text // defaults to "Book Ride"
}: Props): ReactElement {
  return (
    <S.BookRideButtonContainer>
      <S.BookRideButton
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
        <ExternalLinkHidden />
      </S.BookRideButton>
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
    </S.BookRideButtonContainer>
  );
}
