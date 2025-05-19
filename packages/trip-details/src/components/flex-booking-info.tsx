import React from "react";
import { FormattedMessage } from "react-intl";
import { Route } from "@styled-icons/fa-solid/Route";
import { Itinerary } from "@opentripplanner/types";
import coreUtils from "@opentripplanner/core-utils";
import { flatten } from "flat";
import TripDetail from "../trip-detail";
import * as S from "../styled";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

export default function FlexBookingInfo({
  itinerary
}: {
  itinerary: Itinerary;
}): JSX.Element | null {
  const containsFlex = itinerary.legs.some(coreUtils.itinerary.isFlex);
  if (!containsFlex) return null;
  const pickupBookingInfo = itinerary.legs
    .map(leg => leg.pickupBookingInfo)
    .filter(info => !!info);
  const dropOffBookingInfo = itinerary.legs
    .map(leg => leg.dropOffBookingInfo)
    .filter(info => !!info);
  return (
    <TripDetail
      summary={
        <S.FlexSummary>
          <FormattedMessage
            defaultMessage={
              defaultMessages["otpUi.TripDetails.tripIncludesFlex"]
            }
            description="Text stating that portions of the trip include a flex (on-demand) transit service."
            id="otpUi.TripDetails.tripIncludesFlex"
            values={{
              extraMessage: [
                ...new Set([
                  ...pickupBookingInfo.map(info => info.message),
                  ...dropOffBookingInfo.map(info => info.message)
                ])
              ].join(" ")
            }}
          />
        </S.FlexSummary>
      }
      icon={<Route size={17} />}
    />
  );
}
