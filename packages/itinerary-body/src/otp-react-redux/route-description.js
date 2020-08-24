import { legType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "../styled";

export default function RouteDescription({ leg, LegIcon }) {
  const { headsign, routeLongName, routeShortName } = leg;
  return (
    <Styled.LegDescriptionForTransit>
      <Styled.LegIconContainer>
        <LegIcon leg={leg} />
      </Styled.LegIconContainer>
      {routeShortName && (
        <Styled.LegDescriptionRouteShortName>
          {routeShortName}
        </Styled.LegDescriptionRouteShortName>
      )}
      <Styled.LegDescriptionRouteLongName>
        {routeLongName}
        {headsign && (
          <span>
            {" "}
            <Styled.LegDescriptionHeadsignPrefix>
              to
            </Styled.LegDescriptionHeadsignPrefix>{" "}
            {headsign}
          </span>
        )}
      </Styled.LegDescriptionRouteLongName>
    </Styled.LegDescriptionForTransit>
  );
}

RouteDescription.propTypes = {
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};
