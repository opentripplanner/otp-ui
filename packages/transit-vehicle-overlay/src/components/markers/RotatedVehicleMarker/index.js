import React from "react";
import PropTypes from "prop-types";

import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import RotatedMarker from "../RotatedMarker";
import * as utils from "../../../utils";

/**
 * renders circular leaflet markers for the vehicles
 * at higher zoom levels, the icon used in the marker is based on the vehicles mode information
 */
export default function RotatedVehicleMarker({
  children,
  icon,
  isTracked,
  onVehicleClicked,
  vehicle
}) {
  const { lat, lon, heading } = vehicle;

  return (
    <RotatedMarker
      icon={icon}
      position={[lat, lon]}
      rotationAngle={heading}
      rotationOrigin="center center"
      onClick={() => onVehicleClicked(vehicle, isTracked)}
      zIndexOffset={isTracked ? 1000 : 0}
    >
      {children}
    </RotatedMarker>
  );
}

RotatedVehicleMarker.propTypes = {
  /** React children */
  children: PropTypes.arrayOf(PropTypes.element),

  /** An L.divIcon used to render the vehicle. */
  icon: PropTypes.shape({}).isRequired,

  /** tracking boolean + colors all work to color the marker */
  isTracked: PropTypes.bool,

  /** Callback fired when the vehicle marker is clicked (vehicle: object) => {} */
  onVehicleClicked: PropTypes.func,

  /** vehicle record  - @see: core-utils/types/transitVehicleType */
  vehicle: transitVehicleType.isRequired
};

RotatedVehicleMarker.defaultProps = {
  children: null,
  isTracked: false,
  onVehicleClicked: (vehicle, isTracked) => {
    utils.linterIgnoreTheseProps(vehicle, isTracked);
  }
};
