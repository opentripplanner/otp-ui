import * as StyledCircle from "./styled";
import * as utils from "../../../utils";

export const Circle = utils.makeRotatedMarker(
  utils.makeBasicVehicleShape(
    StyledCircle.Shape,
    StyledCircle.TrackedShape,
    zoom => {
      const midZoom = 12;
      const midSize = 13.0;
      const farSize = 7.0;
      return zoom >= midZoom ? midSize : farSize;
    }
  )
);

export const CircledVehicle = utils.makeRotatedMarker(
  ({ color, highlightColor, isTracked, routeType }) => {
    return utils.makeVehicleIcon(
      StyledCircle,
      routeType,
      color,
      highlightColor,
      isTracked
    );
  }
);

// Rename styled components for export
export { StyledCircle as Styled };
