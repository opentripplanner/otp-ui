import React from "react";
import { Tooltip } from "react-leaflet";

import { formatTime } from "../utils";
import { vehicleType } from "../types";

/**
 * presentational component for vehicle marker tooltip
 */
function VehicleToolTip(props) {
  const { vehicle } = props;

  let rsn = vehicle.routeShortName;
  if (rsn !== null && rsn.length <= 3) {
    rsn = `Line ${rsn}`;
  }

  return (
    <Tooltip>
      <span>
        <b>{rsn}</b>: {formatTime(vehicle.seconds)}
      </span>
    </Tooltip>
  );
}

VehicleToolTip.propTypes = {
  vehicle: vehicleType
};

VehicleToolTip.defaultProps = {
  vehicle: null
};

export default VehicleToolTip;
