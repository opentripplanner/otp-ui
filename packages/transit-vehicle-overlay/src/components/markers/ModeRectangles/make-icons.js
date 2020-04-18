import React from "react";
import * as Styled from "./styled";
import * as utils from "../../../utils";

/**
 * find icons based on gtfsdb mode types
 * TODO: both icon names and these modes need to align better to standards
 * TODO: icons using trimet stuff needs to get away from MAX / WES / AERIALTRAM names, etc...
 */
export default function makeIcons(zoom, mode, color, highlight, isTracked) {
  const closeZoom = 14;
  const midZoom = 12;
  const midSize = 13.0;
  const farSize = 7.0;

  let icon;
  if (zoom >= closeZoom) {
    icon = utils.makeVehicleIcon(Styled, mode, color, highlight, isTracked);
  } else {
    const size = zoom >= midZoom ? midSize : farSize;
    icon = isTracked ? (
      <Styled.TrackedShape
        size={size}
        color={color}
        colorselected={highlight}
      />
    ) : (
      <Styled.Shape
        size={size}
        color={color}
        colorselected={highlight}
      />
    );
  }

  return utils.renderAsImage(icon);
}
