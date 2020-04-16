import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "react-leaflet";
import L from "leaflet";

import { transitVehicleType } from "@opentripplanner/core-utils/src/types";
import { formatDurationWithSeconds } from "@opentripplanner/core-utils/src/time";
import { TooltipStyle } from "../styled";
import { linterIgnoreTheseProps } from "../../../utils";

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
        <TooltipStyle.Title>{rsn}</TooltipStyle.Title>
        {formatDurationWithSeconds(vehicle.seconds)} ago
      </TooltipStyle>
    </Tooltip>
  );
}

VehicleTooltip.propTypes = {
  vehicle: transitVehicleType,
  isTracked: PropTypes.bool,
  permanent: PropTypes.bool,
  direction: PropTypes.string,
  offset: PropTypes.object
};

VehicleTooltip.defaultProps = {
  vehicle: null,
  isTracked: false,
  permanent: false,
  direction: "auto",
  offset: new L.Point(0, 0)
};
