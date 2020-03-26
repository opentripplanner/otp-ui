import { legType } from "@opentripplanner/core-utils/lib/types";
import TriMetLegIcon from "@opentripplanner/icons/lib/trimet-leg-icon";
import React from "react";
import styled from "styled-components";

import * as ItineraryBodyClasses from "../styled";

const TriMetLegIconContainer = styled.div`
  float: left;
  height: 24px;
  margin-right: 6px;
  width: 24px;
`;

export default function RouteDescription({ leg }) {
  const { headsign, routeLongName, routeShortName } = leg;
  return (
    <ItineraryBodyClasses.LegDescriptionForTransit>
      <TriMetLegIconContainer>
        <TriMetLegIcon leg={leg} />
      </TriMetLegIconContainer>
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
  leg: legType.isRequired
};
