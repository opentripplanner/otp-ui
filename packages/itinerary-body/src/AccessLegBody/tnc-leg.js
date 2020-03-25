import currencyFormatter from "currency-formatter";
import {
  formatDuration,
  formatTime
} from "@opentripplanner/core-utils/lib/time";
import {
  configType,
  legType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import { isMobile } from "@opentripplanner/core-utils/lib/ui";
import React from "react";
import PropTypes from "prop-types";

import AccessLegSummary from "./access-leg-summary";
import * as Styled from "../styled";

export default function TNCLeg({
  config,
  LYFT_CLIENT_ID,
  UBER_CLIENT_ID,
  followsTransit,
  leg,
  LegIcon,
  onSummaryClick,
  showLegIcon,
  timeOptions
}) {
  const universalLinks = {
    UBER: `https://m.uber.com/${
      isMobile() ? "ul/" : ""
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
      <Styled.PlaceSubheader>
        Wait{" "}
        {!followsTransit && (
          <span>{Math.round(tncData.estimatedArrival / 60)} minutes </span>
        )}
        for {tncData.displayName} pickup
      </Styled.PlaceSubheader>

      <Styled.LegBody>
        {/* The icon/summary row */}
        <AccessLegSummary
          config={config}
          leg={leg}
          LegIcon={LegIcon}
          onSummaryClick={onSummaryClick}
          showLegIcon={showLegIcon}
        />

        {/* The "Book Ride" button */}
        <Styled.BookTNCRideButtonContainer>
          <Styled.BookTNCRideButton
            href={universalLinks[tncData.company]}
            target={isMobile() ? "_self" : "_blank"}
          >
            Book Ride
          </Styled.BookTNCRideButton>
          {followsTransit && <Styled.BookLaterPointer />}
          {followsTransit && (
            <Styled.BookLaterContainer>
              <Styled.BookLaterInnerContainer>
                <Styled.BookLaterText>
                  Wait until{" "}
                  {formatTime(
                    leg.startTime - tncData.estimatedArrival * 1000,
                    timeOptions
                  )}{" "}
                  to book
                </Styled.BookLaterText>
              </Styled.BookLaterInnerContainer>
            </Styled.BookLaterContainer>
          )}
        </Styled.BookTNCRideButtonContainer>

        {/* The estimated travel time */}
        <Styled.StepsHeader>
          Estimated travel time: {formatDuration(leg.duration)} (does not
          account for traffic)
        </Styled.StepsHeader>

        {/* The estimated travel cost */}
        {tncData.minCost && (
          <p>
            Estimated cost:{" "}
            {`${currencyFormatter.format(tncData.minCost, {
              code: tncData.currency
            })} - ${currencyFormatter.format(tncData.maxCost, {
              code: tncData.currency
            })}`}
          </p>
        )}
      </Styled.LegBody>
    </div>
  );
}

TNCLeg.propTypes = {
  config: configType.isRequired,
  LYFT_CLIENT_ID: PropTypes.string,
  UBER_CLIENT_ID: PropTypes.string,
  followsTransit: PropTypes.bool.isRequired,
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  onSummaryClick: PropTypes.func.isRequired,
  showLegIcon: PropTypes.bool.isRequired,
  timeOptions: timeOptionsType
};

TNCLeg.defaultProps = {
  LYFT_CLIENT_ID: "",
  UBER_CLIENT_ID: "",
  timeOptions: null
};
