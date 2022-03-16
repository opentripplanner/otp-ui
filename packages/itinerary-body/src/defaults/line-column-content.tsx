import LocationIcon from "@opentripplanner/location-icon";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";

import RouteBadge from "../RouteBadge";
import * as Styled from "../styled";
import { LineColumnContentProps } from "../types";
import { defaultMessages } from "../util";

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
      modeId: mode
    }
  );

  return (
    <Styled.LegLine>
      {!isDestination && (
        <Styled.InnerLine mode={mode} routeColor={routeColor} />
      )}
      <Styled.LineBadgeContainer>
        {/* TODO: This is a placeholder for a routebadge when we create the transit leg */}
        {!interline && !isDestination && transitLeg && (
          <RouteBadge
            abbreviation={toRouteAbbreviation(parseInt(route, 10) || route)}
            color={routeColor}
            name={routeLongName || ""}
          />
        )}
        {!interline && !isDestination && !transitLeg && (
          <Styled.AccessBadge
            aria-label={travelByMessage}
            mode={mode}
            routeColor={routeColor}
          >
            <LegIcon leg={leg} title={travelByMessage} width="66%" />
          </Styled.AccessBadge>
        )}
        {isDestination && (
          <Styled.Destination>
            <LocationIcon size={25} type="to" />
          </Styled.Destination>
        )}
      </Styled.LineBadgeContainer>
    </Styled.LegLine>
  );
}
