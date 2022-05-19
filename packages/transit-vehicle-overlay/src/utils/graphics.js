// Removed as core-utils is typescripted. TODO: Remove when typescripting!
/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import React from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import L from "leaflet";
import cloneDeep from "lodash.clonedeep";

import RotatedMarker from "../components/markers/RotatedMarker";
import { linterIgnoreTheseProps } from "./data";

/**
 * helper to render a React .svg structure, ala icons/Bus.js as a leaflet marker
 *
 * @param icon
 * @param size
 * @param anchor
 * @param pop
 * @param tt
 * @param cls
 */
export function renderAsImage(
  icon,
  size = [22, 22],
  anchor = null,
  pop = null,
  tt = null,
  cls = ""
) {
  const x = size[0];
  const y = size[1];

  // debugger;
  if (!pop) pop = [0, 0];
  if (!tt) tt = [0, 0];
  if (!anchor) anchor = [Math.round(x / 2), Math.round(y / 2)];

  const retVal = L.divIcon({
    html: ReactDOMServer.renderToString(icon),
    className: cls,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: pop,
    tooltipAnchor: tt
  });
  return retVal;
}

/**
 * will take an input object (e.g., probably a defaultProp representing a leaflet style),
 * deep copy that object, and return back a new obj with the .color set
 *
 * @param color
 * @param obj
 * @return deep copied object with color set
 */
export function setColor(color, obj) {
  const retVal = cloneDeep(obj);
  retVal.color = color;
  return retVal;
}

/**
 * Associates two shapes, one for rendering tracked vehicles, and one for untracked vehicles,
 * and optionally renders a size (number) prop determined by the optional getSize function argument.
 */
export const makeBasicVehicleShape = (NormalShape, TrackedShape, getSize) => {
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

/**
 * makes a circular marker icon with a vehicle image based on mode
 *
 * @param Styled
 * @param mode
 * @param color
 * @param highlightColor
 * @param isTracked
 * @return marker object
 */
export function makeVehicleIcon(
  Styled,
  mode,
  color,
  highlightColor,
  isTracked
) {
  let icon;
  switch (mode) {
    case "TRAM":
      icon = isTracked ? (
        <Styled.TrackedTram color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormTram color={color} colorselected={highlightColor} />
      );
      break;
    case "SC":
      icon = isTracked ? (
        <Styled.TrackedSC color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormSC color={color} colorselected={highlightColor} />
      );
      break;
    case "GONDOLA":
      icon = isTracked ? (
        <Styled.TrackedGond color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormGond color={color} colorselected={highlightColor} />
      );
      break;
    case "RAIL":
    case "SUBWAY":
      icon = isTracked ? (
        <Styled.TrackedRail color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormRail color={color} colorselected={highlightColor} />
      );
      break;
    case "BUS":
      icon = isTracked ? (
        <Styled.TrackedBus color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormBus color={color} colorselected={highlightColor} />
      );
      break;
    default:
      icon = isTracked ? (
        <Styled.TrackedShape color={color} colorselected={highlightColor} />
      ) : (
        <Styled.Shape color={color} colorselected={highlightColor} />
      );
      break;
  }
  return icon;
}

/**
 * different icons per mode is repeated in multiple places. This helper function is reused
 * in multiple places to apply a normal and tracked style, based on various transit modes
 *
 * @param normal
 * @param tracked
 * @param busIcon
 * @param railIcon
 * @param tramIcon
 * @param streetcarIcon
 * @param gondolaIcon
 * @return {array} - styled icon objects (two for each mode, ala tracked and normal styles)
 */
export function makeModeStyles(
  normal,
  tracked,
  busIcon,
  railIcon,
  tramIcon,
  streetcarIcon,
  gondolaIcon
) {
  if (!railIcon) railIcon = busIcon;
  if (!tramIcon) tramIcon = railIcon;
  if (!streetcarIcon) streetcarIcon = railIcon;
  if (!gondolaIcon) gondolaIcon = busIcon;

  const NormBus = styled(busIcon)`
    ${normal}
  `;

  const TrackedBus = styled(NormBus)`
    ${tracked}
  `;

  const NormRail = styled(railIcon)`
    ${normal}
  `;

  const TrackedRail = styled(NormRail)`
    ${tracked}
  `;

  const NormTram = styled(tramIcon)`
    ${normal}
  `;

  const TrackedTram = styled(NormTram)`
    ${tracked}
  `;

  const NormSC = styled(streetcarIcon)`
    ${normal}
  `;

  const TrackedSC = styled(NormSC)`
    ${tracked}
  `;

  const NormGond = styled(gondolaIcon)`
    ${normal}
  `;

  const TrackedGond = styled(NormGond)`
    ${tracked}
  `;

  return [
    NormBus,
    TrackedBus,
    NormRail,
    TrackedRail,
    NormTram,
    TrackedTram,
    NormSC,
    TrackedSC,
    NormGond,
    TrackedGond
  ];
}

/**
 * Renders the provided Icon with a RotatedMarker component (for rendering rotated vehicle symbols)
 * and make the component render the icon with the size returned by the optional getSize function argument.
 */
export const makeRotatedMarker = (Icon, getSize) => {
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
        icon={renderAsImage(icon, getSize && getSize(zoom))}
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
    // vehicle: coreUtils.types.transitVehicleType.isRequired,
    vehicle: PropTypes.object.isRequired,

    /** map zoom: is part of the props due to redrawing this layer on map zoom */
    zoom: PropTypes.number
  };

  VehicleMarker.defaultProps = {
    children: null,
    color: "",
    highlightColor: "",
    isTracked: false,
    onVehicleClicked: (vehicle, isTracked) => {
      linterIgnoreTheseProps(vehicle, isTracked);
    },
    zoom: null
  };

  return VehicleMarker;
};
