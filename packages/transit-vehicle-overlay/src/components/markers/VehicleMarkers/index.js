import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import * as StyledCircle from "../ModeCircles/styled";
import * as StyledRectangle from "../ModeRectangles/styled";
import RotatedMarker from "../RotatedMarker";
import * as utils from "../../../utils";

/**
 * Associates two shapes, one for rendering tracked vehicles, and one for untracked vehicles,
 * and optionally renders a size (number) prop determined by the optional getSize function argument.
 */
const makeBasicVehicleShape = (NormalShape, TrackedShape, getSize) => {
  const Shape = ({ color, highlightColor, isTracked, zoom }) => {
    const size = getSize && getSize(zoom);
    return isTracked ? (
      <TrackedShape color={color} colorselected={highlightColor} size={size} />
    ) : (
      <NormalShape color={color} colorselected={highlightColor} size={size} />
    );
  };

  Shape.propTypes = {
    /** fill color (#AABBCC format) for all (non-tracked) map vehicle markers */
    color: PropTypes.string,

    /** fill color of tracked vehicle */
    highlightColor: PropTypes.string,

    /** tracking boolean + colors all work to color the marker */
    isTracked: PropTypes.bool,

    /** map zoom: is part of the props due to redrawing this layer on map zoom */
    zoom: PropTypes.number
  };

  Shape.defaultProps = {
    color: "",
    highlightColor: "",
    isTracked: false,
    zoom: null
  };

  return Shape;
};

// Define the shape markers for different vehicles and zoom.

const Dot = makeBasicVehicleShape(
  StyledCircle.Shape,
  StyledCircle.TrackedShape,
  zoom => {
    const midZoom = 12;
    const midSize = 13.0;
    const farSize = 7.0;
    return zoom >= midZoom ? midSize : farSize;
  }
);

const LightRailVehicleRectangle = makeBasicVehicleShape(
  StyledRectangle.LgShape,
  StyledRectangle.LgTrackedShape
);

const BusRectangle = makeBasicVehicleShape(
  StyledRectangle.Shape,
  StyledRectangle.TrackedShape
);

const DetailedRectangle = ({ color, highlightColor, isTracked, routeType }) => {
  return utils.makeVehicleIcon(
    StyledRectangle,
    routeType,
    color,
    highlightColor,
    isTracked
  );
};

const CircledVehicle = ({ color, highlightColor, isTracked, routeType }) => {
  return utils.makeVehicleIcon(
    StyledCircle,
    routeType,
    color,
    highlightColor,
    isTracked
  );
};

/**
 * Gets a marker size ([width, height]) for a given zoom level.
 * Used with rectangular vehicle shapes.
 */
function getRectangleSize(zoom) {
  const veryCloseZoom = 19;
  const closeZoom = 14;
  const farZoom = 10;

  let size = zoom;
  if (zoom >= veryCloseZoom) size = zoom * 3;
  else if (zoom >= closeZoom) size = zoom * 2 + 3;
  else if (zoom > farZoom) size = zoom + 6;

  return [size, size];
}

/**
 * Renders the provided Icon with a RotatedMarker component (for rendering rotated vehicle symbols)
 * and make the component render the icon with the size returned by the optional getSize function argument.
 */
const makeRotatedMarker = (Icon, getSize) => {
  const VehicleMarker = ({
    children,
    color,
    highlightColor,
    isTracked,
    onVehicleClicked,
    vehicle,
    zoom
  }) => {
    if (!vehicle) {
      return null;
    }
    const { lat, lon, heading } = vehicle;
    const icon = (
      <Icon
        color={color}
        highlightColor={highlightColor}
        isTracked={isTracked}
        routeType={vehicle.routeType}
        zoom={zoom}
      />
    );

    return (
      <RotatedMarker
        icon={utils.renderAsImage(icon, getSize && getSize(zoom))}
        position={[lat, lon]}
        rotationAngle={heading}
        rotationOrigin="center center"
        onClick={() => onVehicleClicked(vehicle, isTracked)}
        zIndexOffset={isTracked ? 1000 : 0}
      >
        {children}
      </RotatedMarker>
    );
  };

  VehicleMarker.propTypes = {
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
    zoom: PropTypes.number
  };

  VehicleMarker.defaultProps = {
    children: null,
    color: "",
    highlightColor: "",
    isTracked: false,
    onVehicleClicked: (vehicle, isTracked) => {
      utils.linterIgnoreTheseProps(vehicle, isTracked);
    },
    zoom: null
  };

  return VehicleMarker;
};

export default {
  BusRectangle: makeRotatedMarker(BusRectangle, getRectangleSize),
  CircledVehicle: makeRotatedMarker(CircledVehicle),
  DetailedRectangle: makeRotatedMarker(DetailedRectangle, getRectangleSize),
  Dot: makeRotatedMarker(Dot),
  LightRailVehicleRectangle: makeRotatedMarker(
    LightRailVehicleRectangle,
    getRectangleSize
  )
};
