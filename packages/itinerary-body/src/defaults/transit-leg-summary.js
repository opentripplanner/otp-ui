import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "../styled";

/**
 * This is a clickable component that summarizes the leg (travel time, stops
 * passed). On click it will expand and show the list of intermediate stops.
 */
export default function TransitLegSummary({ leg, onClick, stopsExpanded }) {
  return (
    <Styled.TransitLegSummary onClick={onClick}>
      {leg.duration && (
        <span>Ride {coreUtils.time.formatDuration(leg.duration)}</span>
      )}
      {leg.intermediateStops && (
        <span>
          {" / "}
          {leg.intermediateStops.length + 1}
          {" stops "}
          <Styled.CaretToggle expanded={stopsExpanded} />
        </span>
      )}
    </Styled.TransitLegSummary>
  );
}

TransitLegSummary.propTypes = {
  leg: coreUtils.types.legType.isRequired,
  onClick: PropTypes.func.isRequired,
  stopsExpanded: PropTypes.bool.isRequired
};
