import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import { AccessibilityRating } from "../../itinerary-body/lib/ItineraryBody";
import * as S from "./styled";

export default function TNCLeg({
  accessibilityScoreGradationMap,
  leg,
  LegIcon
}) {
  const { tncData } = leg;
  if (!tncData) return null;

  return (
    <S.Leg>
      <S.LegAnnotation>
        <S.ModeIcon>
          <LegIcon leg={leg} />
        </S.ModeIcon>
        {leg.accessibilityScore && (
          <AccessibilityRating
            gradationMap={accessibilityScoreGradationMap}
            score={leg.accessibilityScore}
          />
        )}
      </S.LegAnnotation>
      <S.LegBody>
        <S.LegHeader>
          <b>Take {tncData.displayName}</b> to <b>{leg.to.name}</b>
        </S.LegHeader>
        <S.LegDetails>
          <S.LegDetail>
            Estimated wait time for pickup:{" "}
            <b>{coreUtils.time.formatDuration(tncData.estimatedArrival)}</b>
          </S.LegDetail>
          <S.LegDetail>
            Estimated travel time:{" "}
            <b>{coreUtils.time.formatDuration(leg.duration)}</b> (does not
            account for traffic)
          </S.LegDetail>
        </S.LegDetails>
      </S.LegBody>
    </S.Leg>
  );
}

TNCLeg.propTypes = {
  accessibilityScoreGradationMap: PropTypes.shape({
    color: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.element
  }),
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};

TNCLeg.defaultProps = {
  accessibilityScoreGradationMap: null
};
