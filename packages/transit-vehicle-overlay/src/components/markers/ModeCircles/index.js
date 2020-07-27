import * as StyledCircle from "./styled";
import * as utils from "../../../utils";

const Dot = utils.makeBasicVehicleShape(
  StyledCircle.Shape,
  StyledCircle.TrackedShape,
  zoom => {
    const midZoom = 12;
    const midSize = 13.0;
    const farSize = 7.0;
    return zoom >= midZoom ? midSize : farSize;
  }
);

const CircledVehicle = ({ color, highlightColor, isTracked, routeType }) => {
  return utils.makeVehicleIcon(
    StyledCircle,
    routeType,
    color,
    highlightColor,
    isTracked
  );
};

export default {
  CircledVehicle: utils.makeRotatedMarker(CircledVehicle),
  Dot: utils.makeRotatedMarker(Dot)
};
