// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import {
  Config,
  Leg,
  LegIconComponent,
  TimeOptions
} from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { Duration } from "../defaults";

import * as S from "../styled";
import { defaultMessages } from "../util";

import AccessLegSummary from "./access-leg-summary";

interface Props {
  config: Config;
  LYFT_CLIENT_ID?: string;
  UBER_CLIENT_ID?: string;
  followsTransit: boolean;
  leg: Leg;
  LegIcon: LegIconComponent;
  onSummaryClick: () => void;
  showLegIcon: boolean;
  timeOptions: TimeOptions;
}

export default function TNCLeg({
  config,
  LYFT_CLIENT_ID = "",
  UBER_CLIENT_ID = "",
  followsTransit,
  leg,
  LegIcon,
  onSummaryClick,
  showLegIcon,
  timeOptions
}: Props): ReactElement {
  const universalLinks = {
    UBER: `https://m.uber.com/${
      coreUtils.ui.isMobile() ? "ul/" : ""
    }?client_id=${UBER_CLIENT_ID}&action=setPickup&pickup[latitude]=${
      leg.from.lat
    }&pickup[longitude]=${leg.from.lon}&pickup[formatted_address]=${encodeURI(
      leg.from.name
    )}&dropoff[latitude]=${leg.to.lat}&dropoff[longitude]=${
      leg.to.lon
    }&dropoff[formatted_address]=${encodeURI(leg.to.name)}`,
    LYFT: `https://lyft.com/ride?id=lyft&partner=${LYFT_CLIENT_ID}&pickup[latitude]=${leg.from.lat}&pickup[longitude]=${leg.from.lon}&destination[latitude]=${leg.to.lat}&destination[longitude]=${leg.to.lon}`
  };
  const { tncData } = leg;

  if (!tncData || !tncData.estimatedArrival) return null;
  return (
    <div>
      <S.PlaceSubheader>
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.AccessLegBody.TncLeg.waitForPickup"]
          }
          description="Action text for waiting for a ride-hail vehicle."
          id="otpUi.AccessLegBody.TncLeg.waitForPickup"
          values={{
            company: tncData.displayName,
            minutes: followsTransit
              ? undefined
              : Math.round(tncData.estimatedArrival / 60)
          }}
        />
      </S.PlaceSubheader>

      <S.LegBody>
        {/* The icon/summary row */}
        <AccessLegSummary
          config={config}
          leg={leg}
          LegIcon={LegIcon}
          onSummaryClick={onSummaryClick}
          showLegIcon={showLegIcon}
        />

        {/* The "Book Ride" button */}
        <S.BookTNCRideButtonContainer>
          <S.BookTNCRideButton
            href={universalLinks[tncData.company]}
            target={coreUtils.ui.isMobile() ? "_self" : "_blank"}
          >
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.AccessLegBody.TncLeg.bookRide"]
              }
              description="Action text to book a ride with a ride-hail company."
              id="otpUi.AccessLegBody.TncLeg.bookRide"
            />
          </S.BookTNCRideButton>
          {followsTransit && <S.BookLaterPointer />}
          {followsTransit && (
            <S.BookLaterContainer>
              <S.BookLaterInnerContainer>
                <S.BookLaterText>
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages[
                        "otpUi.AccessLegBody.TncLeg.bookRideLater"
                      ]
                    }
                    description="Hint text to book a ride at a later time."
                    id="otpUi.AccessLegBody.TncLeg.bookRideLater"
                    values={{
                      timeMillis: coreUtils.time.offsetTime(
                        leg.startTime - tncData.estimatedArrival * 1000,
                        timeOptions
                      )
                    }}
                  />
                </S.BookLaterText>
              </S.BookLaterInnerContainer>
            </S.BookLaterContainer>
          )}
        </S.BookTNCRideButtonContainer>

        {/* The estimated travel time */}
        <S.TNCTravelTime>
          <FormattedMessage
            defaultMessage={
              defaultMessages["otpUi.AccessLegBody.TncLeg.estimatedTravelTime"]
            }
            description="Describes the estimated travel time."
            id="otpUi.AccessLegBody.TncLeg.estimatedTravelTime"
            values={{
              duration: <Duration seconds={leg.duration} />
            }}
          />
        </S.TNCTravelTime>

        {/* The estimated travel cost */}
        {tncData.minCost && (
          <S.TNCCost>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.AccessLegBody.TncLeg.estimatedCost"]
              }
              description="Shows the minimum and maximum fares for a TNC ride."
              id="otpUi.AccessLegBody.TncLeg.estimatedCost"
              values={{
                maxFare: (
                  <FormattedNumber
                    currency={tncData.currency}
                    currencyDisplay="narrowSymbol"
                    // This isn't a "real" style prop
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                    value={tncData.maxCost}
                  />
                ),
                minFare: (
                  <FormattedNumber
                    currency={tncData.currency}
                    currencyDisplay="narrowSymbol"
                    // This isn't a "real" style prop
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                    value={tncData.minCost}
                  />
                )
              }}
            />
          </S.TNCCost>
        )}
      </S.LegBody>
    </div>
  );
}
