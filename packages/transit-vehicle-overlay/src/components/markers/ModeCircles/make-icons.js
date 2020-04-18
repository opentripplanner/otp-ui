import React from "react";
import * as Styled from "./styled";
import * as utils from "../../../utils";

/** makes a circular marker icon with a vehicle image based on mode */
export function makeVehicleIcon(zoom, mode, color, highlightColor, isTracked) {
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
        <Styled.TrackedVehicleCircle
          color={color}
          colorselected={highlightColor}
        />
      ) : (
        <Styled.VehicleCircle color={color} colorselected={highlightColor} />
      );
      break;
  }
  return icon;
}

/**
 * find icons based on gtfsdb mode types
 * TODO: both icon names and these modes need to align better to standards
 * TODO: icons using trimet stuff needs to get away from MAX / WES / AERIALTRAM names, etc...
 */
export default function makeIcons(
  zoom,
  mode,
  color,
  highlightColor,
  isTracked
) {
  const closeZoom = 14;
  const midZoom = 12;
  const midSize = 13.0;
  const farSize = 7.0;

  let icon;
  if (zoom >= closeZoom) {
    icon = makeVehicleIcon(zoom, mode, color, highlightColor, isTracked);
  } else {
    const size = zoom >= midZoom ? midSize : farSize;
    icon = isTracked ? (
      <Styled.TrackedVehicleCircle
        size={size}
        color={color}
        colorselected={highlightColor}
      />
    ) : (
      <Styled.VehicleCircle
        size={size}
        color={color}
        colorselected={highlightColor}
      />
    );
  }

  return utils.renderAsImage(icon);
}
