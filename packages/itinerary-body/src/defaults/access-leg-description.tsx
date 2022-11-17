import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import { Config, Leg } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import * as S from "../styled";

import { defaultMessages, getPlaceName } from "../util";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  config: Config;
  leg: Leg;
}

/**
 * Gets the summary mode in the ambient language.
 */
function getSummaryMode(leg: Leg, intl: IntlShape): string {
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
      return leg.hailedCar
        ? intl.formatMessage({
            defaultMessage:
              defaultMessages["otpUi.AccessLegBody.summaryMode.carDrive"],
            description: "Drive somewhere",
            id: "otpUi.AccessLegBody.summaryMode.carDrive"
          })
        : intl.formatMessage({
            defaultMessage:
              defaultMessages["otpUi.AccessLegBody.summaryMode.carHail"],
            description: "Ride in a car/taxi to somewhere",
            id: "otpUi.AccessLegBody.summaryMode.carHail"
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
  // Replace the Vertex Type for BIKESHARE with VEHICLE as we do not know that
  // it is a bike yet because that information is in the next leg with OTP2.
  const toPlace = {
    ...leg.to,
    vertexType:
      leg.to.vertexType === "BIKESHARE" ? "VEHICLE" : leg.to.vertexType
  };
  const modeContent = getSummaryMode(leg, intl);
  const placeContent = (
    <S.LegDescriptionPlace>
      {getPlaceName(toPlace, config.companies, intl)}
    </S.LegDescriptionPlace>
  );

  return (
    // Return an HTML element which is passed a className (and style props)
    // for styled-components support.
    <span className={className} style={style}>
      {leg.distance > 0 ? (
        <FormattedMessage
          defaultMessage="{mode} {distance} to {place}"
          description="Summarizes an access leg, including distance"
          id="otpUi.AccessLegBody.summaryAndDistance"
          values={{
            // TODO: Implement metric vs imperial (up until now it's just imperial).
            distance: humanizeDistanceString(leg.distance, false, intl),
            mode: modeContent,
            place: placeContent
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
