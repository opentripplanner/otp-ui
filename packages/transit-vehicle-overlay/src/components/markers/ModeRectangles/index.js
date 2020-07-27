import * as StyledRectangle from "./styled";
import * as utils from "../../../utils";

const LightRailVehicleRectangle = utils.makeBasicVehicleShape(
  StyledRectangle.LgShape,
  StyledRectangle.LgTrackedShape
);

const BusRectangle = utils.makeBasicVehicleShape(
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

export default {
  BusRectangle: utils.makeRotatedMarker(BusRectangle, getRectangleSize),
  DetailedRectangle: utils.makeRotatedMarker(
    DetailedRectangle,
    getRectangleSize
  ),
  LightRailVehicleRectangle: utils.makeRotatedMarker(
    LightRailVehicleRectangle,
    getRectangleSize
  )
};
