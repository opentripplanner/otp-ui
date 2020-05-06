import { legType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import * as ItineraryBodyClasses from "../styled";

const LegIconContainer = styled.div`
  float: left;
  height: 24px;
  margin-right: 6px;
  width: 24px;
`;

export default function RouteDescription({ leg, LegIcon }) {
  const { headsign, routeLongName, routeShortName } = leg;
  return (
    <ItineraryBodyClasses.LegDescriptionForTransit>
      <LegIconContainer>
        <LegIcon leg={leg} />
      </LegIconContainer>
      {routeShortName && (
        <div>
          <ItineraryBodyClasses.LegDescriptionRouteShortName>
            {routeShortName}
          </ItineraryBodyClasses.LegDescriptionRouteShortName>
        </div>
      )}
      <ItineraryBodyClasses.LegDescriptionRouteLongName>
        {routeLongName}
        {headsign && (
          <span>
            {" "}
            <ItineraryBodyClasses.LegDescriptionHeadsignPrefix>
              to
            </ItineraryBodyClasses.LegDescriptionHeadsignPrefix>{" "}
            {headsign}
          </span>
        )}
      </ItineraryBodyClasses.LegDescriptionRouteLongName>
    </ItineraryBodyClasses.LegDescriptionForTransit>
  );
}

RouteDescription.propTypes = {
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};
