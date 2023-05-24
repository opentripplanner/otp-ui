import { Defaults } from "@opentripplanner/itinerary-body";
import { GradationMap, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import { getCompanyForNetwork } from "@opentripplanner/core-utils/lib/itinerary";
import AccessibilityAnnotation from "./accessibility-annotation";
import * as S from "./styled";

import { defaultMessages, strongText } from "./util";

interface Props {
  accessibilityScoreGradationMap?: GradationMap;
  leg: Leg;
  LegIcon: LegIconComponent;
}

export default function TNCLeg({
  accessibilityScoreGradationMap,
  leg,
  LegIcon
}: Props): ReactElement {
  const { rideHailingEstimate } = leg;
  if (!rideHailingEstimate) return null;

  return (
    <S.Leg>
      <AccessibilityAnnotation
        accessibilityScoreGradationMap={accessibilityScoreGradationMap}
        grayscale
        leg={leg}
        LegIcon={LegIcon}
      />
      <S.LegBody>
        <S.LegHeader>
          <FormattedMessage
            defaultMessage={
              defaultMessages["otpUi.PrintableItinerary.TncLeg.header"]
            }
            description="Summary text for TNC leg"
            id="otpUi.PrintableItinerary.TncLeg.header"
            values={{
              company: getCompanyForNetwork(rideHailingEstimate.provider.id),
              place: leg.to.name,
              strong: strongText
            }}
          />
        </S.LegHeader>
        <S.LegDetails>
          <S.LegDetail>
            <FormattedMessage
              defaultMessage={
                defaultMessages[
                  "otpUi.PrintableItinerary.TncLeg.estimatedWaitTime"
                ]
              }
              description="Describes the estimated TNC wait time."
              id="otpUi.PrintableItinerary.TncLeg.estimatedWaitTime"
              values={{
                duration: <Defaults.Duration seconds={leg.startTime} />,
                strong: strongText
              }}
            />
          </S.LegDetail>
          <S.LegDetail>
            <FormattedMessage
              defaultMessage={
                defaultMessages[
                  "otpUi.PrintableItinerary.TncLeg.estimatedTravelTime"
                ]
              }
              description="Describes the estimated TNC travel time."
              id="otpUi.PrintableItinerary.TncLeg.estimatedTravelTime"
              values={{
                duration: <Defaults.Duration seconds={leg.duration} />,
                strong: strongText
              }}
            />
          </S.LegDetail>
        </S.LegDetails>
      </S.LegBody>
    </S.Leg>
  );
}
