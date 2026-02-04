import coreUtils from "@opentripplanner/core-utils";
import LocationIcon from "@opentripplanner/location-icon";
import React, { ReactElement } from "react";
import { IntlShape, useIntl } from "react-intl";

import RouteBadge from "../RouteBadge";
import * as S from "../styled";
import { LineColumnContentProps } from "../types";
import { defaultMessages } from "../util";

const { getLegRouteLongName, getLegRouteShortName } = coreUtils.itinerary;

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
  showAlightSteps = false,
  toRouteAbbreviation
}: LineColumnContentProps): ReactElement {
  const { mode, routeColor, transitLeg } = leg;
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

  const routeShortName = getLegRouteShortName(leg);
  const showAlightStep = showAlightSteps && !isDestination;

  return (
    <S.LegLine>
      {!isDestination && (
        <S.InnerLine
          $showAlightSteps={showAlightStep}
          mode={mode}
          routeColor={routeColor}
        />
      )}
      <S.LineBadgeContainer>
        {/* TODO: This is a placeholder for a routebadge when we create the transit leg */}
        {!interline && !isDestination && transitLeg && (
          <RouteBadge
            abbreviation={toRouteAbbreviation(
              parseInt(routeShortName, 10) || routeShortName,
            )}
            color={routeColor}
            name={getLegRouteLongName(leg) || ""}
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
      {showAlightStep && (
        <S.LineAlightBadgeContainer>
          <S.AlightingBadge aria-label="Alight here">
            <svg
              id="TRIMET"
              xmlns="http://www.w3.org/2000/svg"
              baseProfile="tiny"
              version="1.2"
              viewBox="0 0 110 150"
            >
              <path
                id="TRIMET-outline"
                d="M60.797,8.204l-.297-.036v-2.198c0-3.033-2.467-5.5-5.5-5.5s-5.5,2.467-5.5,5.5v11.031c-2.559-.651-5.238-1.001-8-1.001-17.949,0-32.5,14.551-32.5,32.5s14.551,32.5,32.5,32.5c2.762,0,5.441-.35,8-1.001v55c0,3.033,2.467,5.5,5.5,5.5s5.5-2.467,5.5-5.5V53.81l.297-.036c11.518-1.378,20.203-11.174,20.203-22.785s-8.686-21.407-20.203-22.785Z"
                fill="#fff"
              />
              <path
                id="TRIMET-rightblade"
                d="M60.5,10.686v40.606c10.139-1.213,18-9.837,18-20.303s-7.861-19.089-18-20.303Z"
                fill="#707070"
              />
              <path
                id="TRIMET-leftblade"
                d="M49.5,19.588c-2.548-.703-5.228-1.087-8-1.087-16.569,0-30,13.431-30,30s13.431,30,30,30c2.772,0,5.452-.384,8-1.087V19.588Z"
                fill="#707070"
              />
              <path
                id="TRIMET-pole"
                d="M55,2.97c1.657,0,3,1.343,3,3v129.03c0,1.657-1.344,3-3,3s-3-1.343-3-3V5.97c0-1.657,1.343-3,3-3"
                fill="#707070"
              />
            </svg>
          </S.AlightingBadge>
        </S.LineAlightBadgeContainer>
      )}
    </S.LegLine>
  );
}
