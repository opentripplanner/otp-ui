import LocationIcon from "@opentripplanner/location-icon";
import React, { ReactElement } from "react";
import { IntlShape, useIntl } from "react-intl";

import RouteBadge from "../RouteBadge";
import * as S from "../styled";
import { LineColumnContentProps } from "../types";
import { defaultMessages } from "../util";

/**
 * Gets the travel mode in the ambient language.
 */
function getTravelMode(modeId: string, intl: IntlShape): string {
  switch (modeId) {
    case "BICYCLE":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ItineraryBody.travelByMode.bike"],
        description: "Travel by bike",
        id: "otpUi.ItineraryBody.travelByMode.bike"
      });
    case "CAR":
      return intl.formatMessage({
        defaultMessage: defaultMessages["otpUi.ItineraryBody.travelByMode.car"],
        description: "Travel by car",
        id: "otpUi.ItineraryBody.travelByMode.car"
      });
    case "MICROMOBILITY":
    case "SCOOTER":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ItineraryBody.travelByMode.escooter"],
        description: "Travel by e-scooter",
        id: "otpUi.ItineraryBody.travelByMode.escooter"
      });
    case "WALK":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ItineraryBody.travelByMode.walk"],
        description: "Travel by walking",
        id: "otpUi.ItineraryBody.travelByMode.walk"
      });
    default:
      return modeId;
  }
}

export default function LineColumnContent({
  interline,
  isDestination,
  leg,
  LegIcon,
  toRouteAbbreviation
}: LineColumnContentProps): ReactElement {
  const { mode, route, routeColor, routeLongName, transitLeg } = leg;
  const intl = useIntl();
  const travelByMessage = intl.formatMessage(
    {
      defaultMessage: defaultMessages["otpUi.ItineraryBody.travelBy"],
      description: "Instructs to travel using a mode",
      id: "otpUi.ItineraryBody.travelBy"
    },
    {
      mode: getTravelMode(mode, intl)
    }
  );

  return (
    <S.LegLine>
      {!isDestination && <S.InnerLine mode={mode} routeColor={routeColor} />}
      <S.LineBadgeContainer>
        {/* TODO: This is a placeholder for a routebadge when we create the transit leg */}
        {!interline && !isDestination && transitLeg && (
          <RouteBadge
            abbreviation={toRouteAbbreviation(parseInt(route, 10) || route)}
            color={routeColor}
            name={routeLongName || ""}
          />
        )}
        {!interline && !isDestination && !transitLeg && (
          <S.AccessBadge
            aria-label={travelByMessage}
            mode={mode}
            routeColor={routeColor}
          >
            <LegIcon leg={leg} title={travelByMessage} width="66%" />
          </S.AccessBadge>
        )}
        {isDestination && (
          <S.Destination>
            <LocationIcon size={25} type="to" />
          </S.Destination>
        )}
      </S.LineBadgeContainer>
    </S.LegLine>
  );
}
