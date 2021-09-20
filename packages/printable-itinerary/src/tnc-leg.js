import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import * as S from "./styled";

export default function TNCLeg({ leg, LegIcon }) {
  const { tncData } = leg;
  if (!tncData) return null;

  return (
    <S.Leg>
      <S.ModeIcon>
        <LegIcon leg={leg} />
      </S.ModeIcon>
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
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};
