import React from "react";
import * as Styled from "./styled";
import * as utils from "../../../utils";

/**
 * find icons based on gtfsdb mode types
 * TODO: both icon names and these modes need to align better to standards
 * TODO: icons using trimet stuff needs to get away from MAX / WES / AERIALTRAM names, etc...
 */
export default function makeIcons(zoom, mode, color, highlight, isTracked) {
  const veryCloseZoom = 19;
  const closeZoom = 14;
  const farZoom = 10;

  let icon;
  if (zoom >= closeZoom) {
    icon = utils.makeVehicleIcon(Styled, mode, color, highlight, isTracked);
  } else if (mode === "BUS") {
    icon = isTracked ? (
      <Styled.TrackedShape color={color} colorselected={highlight} />
    ) : (
      <Styled.Shape color={color} colorselected={highlight} />
    );
  } else {
    icon = isTracked ? (
      <Styled.LgTrackedShape color={color} colorselected={highlight} />
    ) : (
      <Styled.LgShape color={color} colorselected={highlight} />
    );
  }

  // determine
  let size = zoom;
  if (zoom >= veryCloseZoom) size = zoom * 3;
  else if (zoom >= closeZoom) size = zoom * 2 + 3;
  else if (zoom > farZoom) size = zoom + 6;

  return utils.renderAsImage(icon, [size, size]);
}
