import coreUtils from "@opentripplanner/core-utils";
import LocationIcon from "@opentripplanner/location-icon";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "./styled";
import RouteBadge from "./RouteBadge";

export default function DefaultLineColumnContent({
  interline,
  leg,
  LegIcon,
  toRouteAbbreviation
}) {
  return (
    <Styled.LegLine>
      {leg && <Styled.InnerLine mode={leg.mode} routeColor={leg.routeColor} />}
      <Styled.LineBadgeContainer>
        {/* TODO: This is a placeholder for a routebadge when we create the transit leg */}
        {!interline && leg && leg.transitLeg && (
          <RouteBadge
            color={leg.routeColor}
            abbreviation={toRouteAbbreviation(
              parseInt(leg.route, 10) || leg.route
            )}
            name={leg.routeLongName || ""}
          />
        )}
        {!interline && leg && !leg.transitLeg && (
          <Styled.AccessBadge mode={leg.mode} routeColor={leg.routeColor}>
            {<LegIcon leg={leg} title={`Travel by ${leg.mode}`} width="66%" />}
          </Styled.AccessBadge>
        )}
        {!leg && (
          <Styled.Destination>
            <LocationIcon size={25} type="to" />
          </Styled.Destination>
        )}
      </Styled.LineBadgeContainer>
    </Styled.LegLine>
  );
}

DefaultLineColumnContent.propTypes = {
  /** whether this leg is an interlined-transit leg */
  interline: PropTypes.bool.isRequired,
  /** Contains details about leg object that is being displayed */
  leg: coreUtils.types.legType,
  /** A component class used to render the icon for a leg */
  LegIcon: PropTypes.elementType.isRequired,
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: PropTypes.func.isRequired
};

DefaultLineColumnContent.defaultProps = {
  // can be null if this is the destination place
  leg: null
};
