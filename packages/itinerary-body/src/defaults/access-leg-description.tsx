import { Distance, isImperial } from "@opentripplanner/humanize-distance";
import { Config, Leg } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import coreUtils from "@opentripplanner/core-utils";
import * as S from "../styled";

import { defaultMessages, getPlaceName } from "../util";

const { ensureAtLeastOneMinute, toHoursMinutesSeconds } = coreUtils.time;

interface Props extends HTMLAttributes<HTMLSpanElement> {
  config: Config;
  leg: Leg;
}

/**
 * Gets the summary mode in the ambient language.
 */
export function getSummaryMode(leg: Leg, intl: IntlShape): string {
  switch (leg.mode) {
    case "BICYCLE":
      return intl.formatMessage({
        defaultMessage: defaultMessages["otpUi.AccessLegBody.summaryMode.bike"],
        description: "Bike to somewhere",
        id: "otpUi.AccessLegBody.summaryMode.bike"
      });
    case "BICYCLE_RENT":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.AccessLegBody.summaryMode.bikeshare"],
        description: "Bikeshare to somewhere",
        id: "otpUi.AccessLegBody.summaryMode.bikeshare"
      });
    case "CAR":
      return leg.rideHailingEstimate
        ? intl.formatMessage({
            defaultMessage:
              defaultMessages["otpUi.AccessLegBody.summaryMode.carHail"],
            description: "Ride in a car/taxi to somewhere",
            id: "otpUi.AccessLegBody.summaryMode.carHail"
          })
        : intl.formatMessage({
            defaultMessage:
              defaultMessages["otpUi.AccessLegBody.summaryMode.carDrive"],
            description: "Drive somewhere",
            id: "otpUi.AccessLegBody.summaryMode.carDrive"
          });
    case "MICROMOBILITY":
    case "MICROMOBILITY_RENT":
    case "SCOOTER":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.AccessLegBody.summaryMode.escooter"],
        description: "Use an e-scooter",
        id: "otpUi.AccessLegBody.summaryMode.escooter"
      });
    case "WALK":
      return intl.formatMessage({
        defaultMessage: defaultMessages["otpUi.AccessLegBody.summaryMode.walk"],
        description: "Walk to somewhere",
        id: "otpUi.AccessLegBody.summaryMode.walk"
      });
    default:
      return leg.mode;
  }
}

/**
 * Renders leg description text, e.g. "Walk 0.5 mi to..."
 * while letting others style the mode and place text.
 */
export default function AccessLegDescription({
  className,
  config,
  leg,
  style
}: Props): ReactElement {
  const intl = useIntl();
  const { companies, formatDuration, units } = config;
  const { from, distance, duration, to } = leg;
  // Replace the Vertex Type for BIKESHARE with VEHICLE as we do not know that
  // it is a bike yet because that information is in the next leg with OTP2.
  const toPlace = {
    ...to,
    vertexType: to.vertexType === "BIKESHARE" ? "VEHICLE" : to.vertexType
  };
  const modeContent = getSummaryMode(leg, intl);
  const placeContent = (
    <S.LegDescriptionPlace>
      {getPlaceName(toPlace, companies, intl)}
    </S.LegDescriptionPlace>
  );

  const durationSeconds = ensureAtLeastOneMinute(duration);

  // TODO: is this causing issues with TNC legs? Do walk legs leading to a TNC
  // trip really have the same `to.stopId` as `from.stopId`?
  const isTransferLeg = to.stopId === from.stopId;
  return (
    // Return an HTML element which is passed a className (and style props)
    // for styled-components support.
    <span className={className} style={style}>
      {distance > 0 ? (
        <FormattedMessage
          defaultMessage="{mode} {distance} to {place}"
          description="Summarizes an access leg, including distance"
          id="otpUi.AccessLegBody.summaryAndDistance"
          values={{
            distance: (
              <Distance
                long={isImperial(units)}
                meters={distance}
                units={units}
              />
            ),
            // This is not used by the default string,
            // but supplying it allows a user who is overriding the string to use it
            // This relies on `formatDuration` being passed into the itinerary body config.
            // That method is used to generate the duration string
            duration:
              formatDuration && formatDuration(durationSeconds, intl, false),
            mode: modeContent,
            place: placeContent
          }}
        />
      ) : isTransferLeg ? (
        <FormattedMessage
          defaultMessage="Transfer, wait {duration}"
          description="Summarizes a transfer leg"
          id="otpUi.AccessLegBody.transfer"
          values={{
            duration: intl.formatMessage(
              {
                id: "otpUi.ItineraryBody.common.durationShort"
              },
              {
                approximatePrefix: false,
                ...toHoursMinutesSeconds(durationSeconds)
              }
            )
          }}
        />
      ) : (
        <FormattedMessage
          defaultMessage="{mode} to {place}"
          description="Summarizes an access leg"
          id="otpUi.AccessLegBody.summary"
          values={{
            mode: modeContent,
            place: placeContent
          }}
        />
      )}
    </span>
  );
}
