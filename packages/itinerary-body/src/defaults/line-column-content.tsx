import { Leg } from "@opentripplanner/types";
import LocationIcon from "@opentripplanner/location-icon";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";

import RouteBadge from "../RouteBadge";
import * as Styled from "../styled";
import { defaultMessages } from "../util";
import { LegIconComponent } from "../types";

interface Props {
  /** Whether this leg is an interlined-transit leg */
  interline: boolean;
  /** Whether this place row represents the destination */
  isDestination: boolean;
  /** Contains details about leg object that is being displayed */
  leg: Leg;
  /** A component class used to render the icon for a leg */
  LegIcon: LegIconComponent;
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: (route: string | number) => string;
}

export default function LineColumnContent({
  interline,
  isDestination,
  leg,
  LegIcon,
  toRouteAbbreviation
}: Props): ReactElement {
  const { mode, route, routeColor, routeLongName, transitLeg } = leg;
  const intl = useIntl();
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
          <Styled.AccessBadge mode={mode} routeColor={routeColor}>
            <LegIcon
              leg={leg}
              title={intl.formatMessage(
                {
                  defaultMessage:
                    defaultMessages["otpUi.ItineraryBody.travelBy"],
                  description: "Instructs to travel using a mode",
                  id: "otpUi.ItineraryBody.travelBy"
                },
                {
                  modeId: mode
                }
              )}
              width="66%"
            />
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
