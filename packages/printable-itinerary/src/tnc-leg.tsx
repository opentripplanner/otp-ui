import coreUtils from "@opentripplanner/core-utils";
import { GradationMap, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

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
  const { tncData } = leg;
  if (!tncData) return null;

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
            defaultMessage={defaultMessages["otpUi.printable.TncLeg.header"]}
            description="Summary text for TNC leg"
            id="otpUi.printable.TncLeg.header"
            values={{
              company: tncData.displayName,
              place: leg.to.name,
              strong: strongText
            }}
          />
        </S.LegHeader>
        <S.LegDetails>
          <S.LegDetail>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.printable.TncLeg.estimatedWaitTime"]
              }
              description="Describes the estimated TNC wait time."
              id="otpUi.printable.TncLeg.estimatedWaitTime"
              values={{
                duration: (
                  // TODO: Refactor?
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages[
                        "otpUi.ItineraryBody.common.durationShort"
                      ]
                    }
                    description="Duration in abbreviated hours (if over one hour) and minutes"
                    id="otpUi.ItineraryBody.common.durationShort"
                    values={coreUtils.time.toHoursMinutesSeconds(
                      tncData.estimatedArrival
                    )}
                  />
                ),
                strong: strongText
              }}
            />
          </S.LegDetail>
          <S.LegDetail>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.printable.TncLeg.estimatedTravelTime"]
              }
              description="Describes the estimated TNC travel time."
              id="otpUi.printable.TncLeg.estimatedTravelTime"
              values={{
                duration: (
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages[
                        "otpUi.ItineraryBody.common.durationShort"
                      ]
                    }
                    description="Duration in abbreviated hours (if over one hour) and minutes"
                    id="otpUi.ItineraryBody.common.durationShort"
                    values={coreUtils.time.toHoursMinutesSeconds(leg.duration)}
                  />
                ),
                strong: strongText
              }}
            />
          </S.LegDetail>
        </S.LegDetails>
      </S.LegBody>
    </S.Leg>
  );
}
