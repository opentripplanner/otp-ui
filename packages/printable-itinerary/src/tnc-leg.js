import { legType } from "@opentripplanner/core-utils/lib/types";
import { formatDuration } from "@opentripplanner/core-utils/lib/time";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "./styled";

export default function TNCLeg({ leg, LegIcon }) {
  const { tncData } = leg;
  if (!tncData) return null;

  return (
    <Styled.Leg>
      <Styled.ModeIcon>
        <LegIcon leg={leg} />
      </Styled.ModeIcon>
      <Styled.LegBody>
        <Styled.LegHeader>
          <b>Take {tncData.displayName}</b> to <b>{leg.to.name}</b>
        </Styled.LegHeader>
        <Styled.LegDetails>
          <Styled.LegDetail>
            Estimated wait time for pickup:{" "}
            <b>{formatDuration(tncData.estimatedArrival)}</b>
          </Styled.LegDetail>
          <Styled.LegDetail>
            Estimated travel time: <b>{formatDuration(leg.duration)}</b> (does
            not account for traffic)
          </Styled.LegDetail>
        </Styled.LegDetails>
      </Styled.LegBody>
    </Styled.Leg>
  );
}

TNCLeg.propTypes = {
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};
