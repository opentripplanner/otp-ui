import React from "react";
import { Tooltip } from "react-leaflet";
import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import { formatDurationWithSeconds } from "@opentripplanner/core-utils/lib/time";
import { TooltipStyle } from "./styled";

/**
 * presentational component for vehicle marker tooltip
 */
function VehicleToolTip(props) {
  const { vehicle } = props;

  let rsn = vehicle.routeShortName;
  if (rsn !== null && rsn.length <= 3) {
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
