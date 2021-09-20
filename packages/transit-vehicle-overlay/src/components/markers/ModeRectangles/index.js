import * as StyledRectangle from "./styled";
import * as utils from "../../../utils";

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

export const LightRailVehicleRectangle = utils.makeRotatedMarker(
  utils.makeBasicVehicleShape(
    StyledRectangle.LgShape,
    StyledRectangle.LgTrackedShape
  ),
  getRectangleSize
);

export const BusRectangle = utils.makeRotatedMarker(
  utils.makeBasicVehicleShape(
    StyledRectangle.Shape,
    StyledRectangle.TrackedShape
  ),
  getRectangleSize
);

export const DetailedRectangle = utils.makeRotatedMarker(
  ({ color, highlightColor, isTracked, routeType }) => {
    return utils.makeVehicleIcon(
      StyledRectangle,
      routeType,
      color,
      highlightColor,
      isTracked
    );
  },
  getRectangleSize
);

// Rename styled components for export
export { StyledRectangle as Styled };
