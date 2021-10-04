import { accessibilityScoreGradationMapShape } from "@opentripplanner/itinerary-body";
import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import AccessibilityAnnotation from "./accessibility-annotation";
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
      <AccessibilityAnnotation
        accessibilityScoreGradationMap={accessibilityScoreGradationMap}
        grayscale
        leg={leg}
        LegIcon={LegIcon}
      />
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
  accessibilityScoreGradationMap: accessibilityScoreGradationMapShape,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};

TNCLeg.defaultProps = {
  accessibilityScoreGradationMap: null
};
