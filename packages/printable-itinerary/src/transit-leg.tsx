import { Defaults } from "@opentripplanner/itinerary-body";
import { GradationMap, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import AccessibilityAnnotation from "./accessibility-annotation";
import * as S from "./styled";
import { defaultMessages, strongText } from "./util";

interface Props {
  accessibilityScoreGradationMap?: GradationMap;
  interlineFollows?: boolean;
  leg: Leg;
  LegIcon: LegIconComponent;
}

export default function TransitLeg({
  accessibilityScoreGradationMap,
  leg,
  LegIcon,
  interlineFollows
}: Props): ReactElement {
  const routeDescription = (
    <>
      <strong>{leg.routeShortName}</strong> <S.RouteLongName leg={leg} />
    </>
  );

  const alightMessage = (
    <FormattedMessage
      defaultMessage={
        defaultMessages["otpUi.PrintableItinerary.TransitLeg.alight"]
      }
      description="Instructs to alight/exit a transit vehicle"
      id="otpUi.PrintableItinerary.TransitLeg.alight"
      values={{
        place: leg.to.name,
        strong: strongText,
        time: leg.endTime
      }}
    />
  );

  // Handle case of transit leg interlined w/ previous
  if (leg.interlineWithPreviousLeg) {
    return (
      <S.CollapsedTop>
        <S.LegBody>
          <S.LegHeader>
            <FormattedMessage
              defaultMessage={
                defaultMessages[
                  "otpUi.PrintableItinerary.TransitLeg.continuesAs"
                ]
              }
              description="Informs of an interlined transit route"
              id="otpUi.PrintableItinerary.TransitLeg.continuesAs"
              values={{
                routeDescription
              }}
            />
          </S.LegHeader>
          <S.LegDetails>
            <S.LegDetail>{alightMessage}</S.LegDetail>
          </S.LegDetails>
        </S.LegBody>
      </S.CollapsedTop>
    );
  }

  return (
    <S.Leg>
      <AccessibilityAnnotation
        accessibilityScoreGradationMap={accessibilityScoreGradationMap}
        grayscale
        leg={leg}
        LegIcon={LegIcon}
      />
      <S.LegBody>
        <S.LegHeader>{routeDescription}</S.LegHeader>
        <S.LegDetails>
          <S.LegDetail>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.PrintableItinerary.TransitLeg.board"]
              }
              description="Instructs to board a transit vehicle"
              id="otpUi.PrintableItinerary.TransitLeg.board"
              values={{
                place: leg.from.name,
                strong: strongText,
                time: leg.startTime
              }}
            />
          </S.LegDetail>
          <S.LegDetail>
            {interlineFollows ? (
              <Defaults.StayOnBoard place={leg.to} />
            ) : (
              alightMessage
            )}
          </S.LegDetail>
        </S.LegDetails>
      </S.LegBody>
    </S.Leg>
  );
}
