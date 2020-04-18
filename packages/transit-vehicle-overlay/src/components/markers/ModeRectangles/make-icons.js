import React from "react";
import * as Styled from "./styled";
import * as utils from "../../../utils";

import Bus from "./images/bus";
import Rail from "./images/rail";
import Rect from "./images/rect";

/** makes a circular marker icon with a vehicle image based on mode */
export function makeVehicleIcon(zoom, mode, color, highlightColor, isTracked) {
  let icon;
  switch (mode) {
    case "SC":
    case "RAIL":
    case "GONDOLA":
    case "TRAM":
      icon = isTracked ? (
        <Rail xcolor={color} colorselected={highlightColor} />
      ) : (
        <Rail xcolor={color} colorselected={highlightColor} />
      );
      break;
    case "BUS":
      icon = isTracked ? (
        <Bus color={color} colorselected={highlightColor} />
      ) : (
        <Bus color={color} colorselected={highlightColor} />
      );
      break;
    default:
      icon = isTracked ? (
        <Rect color={color} colorselected={highlightColor} />
      ) : (
        <Rect color={color} colorselected={highlightColor} />
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
      <Rect
        size={size}
        color={color}
        colorselected={highlightColor}
      />
    ) : (
      <Rect
        size={size}
        color={color}
        colorselected={highlightColor}
      />
    );
  }

  return utils.renderAsImage(icon);
}
