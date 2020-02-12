import React from "react";
import { Tooltip } from "react-leaflet";
import { transitVehicleType } from "@opentripplanner/core-utils/src/types";
import { formatDurationWithSeconds } from "@opentripplanner/core-utils/src/time";
import { TooltipStyle } from "./styled";

/**
 * presentational component for vehicle marker tooltip
 */
function VehicleToolTip(props) {
  const { vehicle } = props;

  let rsn = vehicle.routeShortName;
  if (rsn !== null && rsn.length <= 5) {
    rsn = `Line ${rsn}:`;
  }

  return (
    <Tooltip>
      <TooltipStyle>
        <TooltipStyle.Title>{rsn} </TooltipStyle.Title>
        {formatDurationWithSeconds(vehicle.seconds)} ago
      </TooltipStyle>
    </Tooltip>
  );
}

VehicleToolTip.propTypes = {
  vehicle: transitVehicleType
};

VehicleToolTip.defaultProps = {
  vehicle: null
};

export default VehicleToolTip;
