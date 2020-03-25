import { legType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import { formatDuration } from "@opentripplanner/core-utils/lib/time";

import * as Styled from "../styled";

export default function TransitLegSummary({ leg, stopsExpanded }) {
  return (
    <>
      {leg.duration && <span>Ride {formatDuration(leg.duration)}</span>}
      {leg.intermediateStops && (
        <span>
          {" / "}
          {leg.intermediateStops.length + 1}
          {" stops "}
          <Styled.CaretToggle expanded={stopsExpanded} />
        </span>
      )}
    </>
  );
}

TransitLegSummary.propTypes = {
  leg: legType.isRequired,
  stopsExpanded: PropTypes.bool.isRequired
};
