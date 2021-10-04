import { accessibilityScoreGradationMapShape } from "@opentripplanner/itinerary-body";
import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import AccessibilityAnnotation from "./accessibility-annotation";
import * as S from "./styled";

export default function TransitLeg({
  accessibilityScoreGradationMap,
  leg,
  LegIcon,
  interlineFollows,
  timeOptions
}) {
  // Handle case of transit leg interlined w/ previous
  if (leg.interlineWithPreviousLeg) {
    return (
      <S.CollapsedTop>
        <S.LegBody>
          <S.LegHeader>
            Continues as{" "}
            <b>
              {leg.routeShortName} {leg.routeLongName}
            </b>{" "}
            to <b>{leg.to.name}</b>
          </S.LegHeader>
          <S.LegDetails>
            <S.LegDetail>
              Get off at <b>{leg.to.name}</b> at{" "}
              {coreUtils.time.formatTime(leg.endTime, timeOptions)}
            </S.LegDetail>
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
        <S.LegHeader>
          <b>
            {leg.routeShortName} {leg.routeLongName}
          </b>{" "}
          to <b>{leg.to.name}</b>
        </S.LegHeader>
        <S.LegDetails>
          <S.LegDetail>
            Board at <b>{leg.from.name}</b> at{" "}
            {coreUtils.time.formatTime(leg.startTime, timeOptions)}
          </S.LegDetail>
          <S.LegDetail>
            {interlineFollows ? (
              <span>
                Stay on board at <b>{leg.to.name}</b>
              </span>
            ) : (
              <span>
                Get off at <b>{leg.to.name}</b> at{" "}
                {coreUtils.time.formatTime(leg.endTime, timeOptions)}
              </span>
            )}
          </S.LegDetail>
        </S.LegDetails>
      </S.LegBody>
    </S.Leg>
  );
}

TransitLeg.propTypes = {
  accessibilityScoreGradationMap: accessibilityScoreGradationMapShape,
  interlineFollows: PropTypes.bool,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  timeOptions: coreUtils.types.timeOptionsType
};

TransitLeg.defaultProps = {
  accessibilityScoreGradationMap: null,
  interlineFollows: false,
  timeOptions: null
};
