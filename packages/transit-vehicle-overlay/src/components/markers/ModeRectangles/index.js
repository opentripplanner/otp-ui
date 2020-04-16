import React from "react";
import PropTypes from "prop-types";

import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import RotatedMarker from "../RotatedMarker";

// import * as Styled from "./styled";
import * as utils from "../../../utils";
import Bus from "./images/bus";
import Rect from "./images/rect";

export default function ModeRectangles(props) {
  const { zoom, vehicle, children, isTracked } = props;
  const { lat, lon, heading } = vehicle;

  // TODO
  let icon;
  if (zoom < 13) icon = utils.renderAsImage(<Rect />);
  else icon = utils.renderAsImage(<Bus />);

  return (
    <RotatedMarker
      icon={icon}
      position={[lat, lon]}
      rotationAngle={heading}
      rotationOrigin="center center"
      onClick={() => props.onVehicleClicked(vehicle, isTracked)}
      zIndexOffset={isTracked ? 1000 : 0}
    >
      {children}
    </RotatedMarker>
  );
}

ModeRectangles.propTypes = {
  zoom: PropTypes.number,
  vehicle: transitVehicleType.isRequired,
  isTracked: PropTypes.bool,

  /** Callback fired when the vehicle is clicked (vehicle: object) => {} */
  onVehicleClicked: PropTypes.func,

  /** React children */
  children: PropTypes.array
};

ModeRectangles.defaultProps = {
  zoom: 13,
  isTracked: false,
  onVehicleClicked: (vehicle, isTracked) => {
    utils.linterIgnoreTheseProps(vehicle, isTracked);
  },
  children: null
};
