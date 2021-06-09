import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "./styled";

export default function TransitLeg({
  leg,
  LegIcon,
  interlineFollows,
  timeOptions
}) {
  // Handle case of transit leg interlined w/ previous
  if (leg.interlineWithPreviousLeg) {
    return (
      <Styled.CollapsedTop>
        <Styled.LegBody>
          <Styled.LegHeader>
            Continues as{" "}
            <b>
              {leg.routeShortName} {leg.routeLongName}
            </b>{" "}
            to <b>{leg.to.name}</b>
          </Styled.LegHeader>
          <Styled.LegDetails>
            <Styled.LegDetail>
              Get off at <b>{leg.to.name}</b> at{" "}
              {coreUtils.time.formatTime(leg.endTime, timeOptions)}
            </Styled.LegDetail>
          </Styled.LegDetails>
        </Styled.LegBody>
      </Styled.CollapsedTop>
    );
  }

  return (
    <Styled.Leg>
      <Styled.ModeIcon>
        <LegIcon leg={leg} />
      </Styled.ModeIcon>
      <Styled.LegBody>
        <Styled.LegHeader>
          <b>
            {leg.routeShortName} {leg.routeLongName}
          </b>{" "}
          to <b>{leg.to.name}</b>
        </Styled.LegHeader>
        <Styled.LegDetails>
          <Styled.LegDetail>
            Board at <b>{leg.from.name}</b> at{" "}
            {coreUtils.time.formatTime(leg.startTime, timeOptions)}
          </Styled.LegDetail>
          <Styled.LegDetail>
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
          </Styled.LegDetail>
        </Styled.LegDetails>
      </Styled.LegBody>
    </Styled.Leg>
  );
}

TransitLeg.propTypes = {
  interlineFollows: PropTypes.bool,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  timeOptions: coreUtils.types.timeOptionsType
};

TransitLeg.defaultProps = {
  interlineFollows: false,
  timeOptions: null
};
