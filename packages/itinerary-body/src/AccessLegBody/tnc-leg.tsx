import coreUtils from "@opentripplanner/core-utils";
import { Config, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { getCompanyForNetwork } from "@opentripplanner/core-utils/lib/itinerary";
import { Duration } from "../defaults";

import * as S from "../styled";
import { defaultMessages } from "../util";

import AccessLegSummary from "./access-leg-summary";

interface Props {
  config: Config;
  followsTransit: boolean;
  leg: Leg;
  LegIcon: LegIconComponent;
  LYFT_CLIENT_ID?: string;
  onSummaryClick: () => void;
  showLegIcon: boolean;
  UBER_CLIENT_ID?: string;
}

export default function TNCLeg({
  config,
  followsTransit,
  leg,
  LegIcon,
  LYFT_CLIENT_ID = "",
  onSummaryClick,
  showLegIcon,
  UBER_CLIENT_ID = ""
}: Props): ReactElement {
  const universalLinks = {
    uber: `https://m.uber.com/${
      coreUtils.ui.isMobile() ? "ul/" : ""
    }?client_id=${UBER_CLIENT_ID}&action=setPickup&pickup[latitude]=${
      leg.from.lat
    }&pickup[longitude]=${leg.from.lon}&pickup[formatted_address]=${encodeURI(
      leg.from.name
    )}&dropoff[latitude]=${leg.to.lat}&dropoff[longitude]=${
      leg.to.lon
    }&dropoff[formatted_address]=${encodeURI(leg.to.name)}`,
    lyft: `https://lyft.com/ride?id=lyft&partner=${LYFT_CLIENT_ID}&pickup[latitude]=${leg.from.lat}&pickup[longitude]=${leg.from.lon}&destination[latitude]=${leg.to.lat}&destination[longitude]=${leg.to.lon}`
  };
  const { rideHailingEstimate } = leg;
  if (!rideHailingEstimate) return null;
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
            company: getCompanyForNetwork(
              rideHailingEstimate.provider.id,
              config.companies
            )?.label,
            minutes: followsTransit ? 0 : rideHailingEstimate.arrival
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
            href={universalLinks[rideHailingEstimate.provider.id]}
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
                      timeMillis: rideHailingEstimate.arrival
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
        {rideHailingEstimate.minPrice && (
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
                    currency={rideHailingEstimate.maxPrice.currency.code}
                    currencyDisplay="narrowSymbol"
                    // This isn't a "real" style prop
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                    value={rideHailingEstimate.maxPrice.amount}
                  />
                ),
                minFare: (
                  <FormattedNumber
                    currency={rideHailingEstimate.minPrice.currency.code}
                    currencyDisplay="narrowSymbol"
                    // This isn't a "real" style prop
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                    value={rideHailingEstimate.minPrice.amount}
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
