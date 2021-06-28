import coreUtils from "@opentripplanner/core-utils";
import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "./styled";

export default function AccessLeg({ config, leg, LegIcon }) {
  return (
    <Styled.Leg>
      <Styled.ModeIcon>
        <LegIcon leg={leg} />
      </Styled.ModeIcon>
      <Styled.LegBody>
        <Styled.LegHeader>
          <b>{coreUtils.itinerary.getLegModeLabel(leg)}</b>{" "}
          {leg.distance > 0 && (
            <span> {humanizeDistanceString(leg.distance)}</span>
          )}
          {" to "}
          <b>{coreUtils.itinerary.getPlaceName(leg.to, config.companies)}</b>
        </Styled.LegHeader>
        {!leg.hailedCar && (
          <Styled.LegDetails>
            {leg.steps.map((step, k) => {
              return (
                <Styled.LegDetail key={k}>
                  {coreUtils.itinerary.getStepDirection(step)} on{" "}
                  <b>{coreUtils.itinerary.getStepStreetName(step)}</b>
                </Styled.LegDetail>
              );
            })}
          </Styled.LegDetails>
        )}
      </Styled.LegBody>
    </Styled.Leg>
  );
}

AccessLeg.propTypes = {
  config: coreUtils.types.configType.isRequired,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};
