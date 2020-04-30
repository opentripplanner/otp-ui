import React from "react";
import PropTypes from "prop-types";

import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import RotatedMarker from "../RotatedMarker";
import makeIcons from "./make-icons";
import * as utils from "../../../utils";

export default function ModeCircles(props) {
  const { zoom, vehicle, children, color, highlightColor, isTracked } = props;
  const { lat, lon, heading, routeType } = vehicle;
  const icon = makeIcons(zoom, routeType, color, highlightColor, isTracked);

  return (
    <RotatedMarker
      icon={icon}
      position={[lat, lon]}
      rotationAngle={heading}
      rotationOrigin="center center"
      onClick={() => props.onVehicleClicked(vehicle, isTracked)}
      zIndexOffset={isTracked ? 1000 : 0}
    >
      {children}
    </RotatedMarker>
  );
}

ModeCircles.propTypes = {
  /** map zoom: is part of the props due to redrawing this layer on map zoom */
  zoom: PropTypes.number,

  /** vehicle record  - @see: core-utils/types/transitVehicleType */
  vehicle: transitVehicleType.isRequired,

  /** tracking boolean + colors all work to color the marker */
  isTracked: PropTypes.bool,

  /** fill color (#AABBCC format) for all (non-tracked) map vehicle markers */
  color: PropTypes.string,

  /** fill color of tracked vehicle */
  highlightColor: PropTypes.string,

  /** Callback fired when the vehicle marker is clicked (vehicle: object) => {} */
  onVehicleClicked: PropTypes.func,

  /** React children */
  children: PropTypes.arrayOf(PropTypes.element)
};

ModeCircles.defaultProps = {
  zoom: null,
  isTracked: false,
  color: "",
  highlightColor: "",
  onVehicleClicked: (vehicle, isTracked) => {
    utils.linterIgnoreTheseProps(vehicle, isTracked);
  },
  children: null
};
