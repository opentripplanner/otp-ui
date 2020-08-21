import { legType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import { formatDuration } from "@opentripplanner/core-utils/lib/time";

import * as Styled from "../styled";

/**
 * This is a clickable component that summarizes the leg (travel time, stops
 * passed). On click it will expand and show the list of intermediate stops.
 */
export default function TransitLegSummary({ leg, onClick, stopsExpanded }) {
  return (
    <Styled.TransitLegSummary onClick={onClick}>
      {leg.duration && <span>Ride {formatDuration(leg.duration)}</span>}
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
  leg: legType.isRequired,
  onClick: PropTypes.func.isRequired,
  stopsExpanded: PropTypes.bool.isRequired
};
