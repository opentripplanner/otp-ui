import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "../ModeCircles/styled";
import RotatedVehicleMarker from "../RotatedVehicleMarker";
import * as utils from "../../../utils";

// Shared prop type definitions.
const propTypes = {
  /** React children */
  children: PropTypes.arrayOf(PropTypes.element),

  /** fill color (#AABBCC format) for all (non-tracked) map vehicle markers */
  color: PropTypes.string,

  /** fill color of tracked vehicle */
  highlightColor: PropTypes.string,

  /** tracking boolean + colors all work to color the marker */
  isTracked: PropTypes.bool,

  /** Callback fired when the vehicle marker is clicked (vehicle: object) => {} */
  onVehicleClicked: PropTypes.func,

  /** vehicle record  - @see: core-utils/types/transitVehicleType */
  vehicle: transitVehicleType.isRequired,

  /** map zoom: is part of the props due to redrawing this layer on map zoom */
  // eslint-disable-next-line react/no-unused-prop-types
  zoom: PropTypes.number
};

const defaultProps = {
  zoom: null,
  isTracked: false,
  color: "",
  highlightColor: "",
  onVehicleClicked: (vehicle, isTracked) => {
    utils.linterIgnoreTheseProps(vehicle, isTracked);
  },
  children: null
};

const Dot = ({
  children,
  color,
  highlightColor,
  isTracked,
  onVehicleClicked,
  vehicle,
  zoom
}) => {
  const midZoom = 12;
  const midSize = 13.0;
  const farSize = 7.0;
  const size = zoom >= midZoom ? midSize : farSize;

  const icon = isTracked ? (
    <Styled.TrackedShape
      size={size}
      color={color}
      colorselected={highlightColor}
    />
  ) : (
    <Styled.Shape size={size} color={color} colorselected={highlightColor} />
  );

  return (
    <RotatedVehicleMarker
      icon={utils.renderAsImage(icon)}
      isTracked={isTracked}
      onVehicleClicked={onVehicleClicked}
      vehicle={vehicle}
    >
      {children}
    </RotatedVehicleMarker>
  );
};
Dot.propTypes = propTypes;
Dot.defaultProps = defaultProps;

const CircledVehicle = ({
  children,
  color,
  highlightColor,
  isTracked,
  onVehicleClicked,
  vehicle
}) => {
  const icon = utils.makeVehicleIcon(
    Styled,
    vehicle.routeType,
    color,
    highlightColor,
    isTracked
  );

  return (
    <RotatedVehicleMarker
      icon={utils.renderAsImage(icon)}
      isTracked={isTracked}
      onVehicleClicked={onVehicleClicked}
      vehicle={vehicle}
    >
      {children}
    </RotatedVehicleMarker>
  );
};
CircledVehicle.propTypes = propTypes;
CircledVehicle.defaultProps = defaultProps;

export default {
  Dot,
  CircledVehicle
};
