import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "react-leaflet";
import L from "leaflet";

import { transitVehicleType } from "@opentripplanner/core-utils/src/types";
import { formatDurationWithSeconds } from "@opentripplanner/core-utils/src/time";
import { TooltipStyle } from "../styled";
import { linterIgnoreTheseProps } from "../../../utils";

/** will show a (leaflet) map tooltip on a vehicle, showing route and update recency */
export default function VehicleTooltip(props) {
  const { vehicle, isTracked, direction, permanent, offset } = props;
  linterIgnoreTheseProps(isTracked);

  let rsn = vehicle.routeShortName;
  if (rsn !== null && rsn.length <= 5) {
    rsn = `Line ${rsn}:`;
  }

  return (
    <Tooltip permanent={permanent} direction={direction} offset={offset}>
      <TooltipStyle>
        <TooltipStyle.Title>{rsn}&nbsp;</TooltipStyle.Title>
        {formatDurationWithSeconds(vehicle.seconds)} ago
      </TooltipStyle>
    </Tooltip>
  );
}

VehicleTooltip.propTypes = {
  /** vehicle record - @see: core-utils/types/transitVehicleType */
  vehicle: transitVehicleType,

  /** indicate if this vehicle is being tracked, */
  isTracked: PropTypes.bool,

  /** is the tip always shown, or just shown on mouse hover */
  permanent: PropTypes.bool,

  /** tip placement (side(s), top, bottom) */
  direction: PropTypes.string,

  /** center of the marker, or some X,Y position in relation to the marker's center */
  offset: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

VehicleTooltip.defaultProps = {
  vehicle: null,
  isTracked: false,
  permanent: false,
  direction: "auto",
  offset: new L.Point(0, 0)
};
