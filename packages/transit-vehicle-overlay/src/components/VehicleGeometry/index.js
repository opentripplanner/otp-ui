import React from "react";
import PropTypes from "prop-types";
import { useLeaflet } from "react-leaflet";

import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import ModeCircles from "../markers/ModeCircles";
import { linterIgnoreTheseProps } from "../../utils";

export default function VehicleGeometry(props) {
  const {
    zoom,
    vehicle,
    isTracked,
    onVehicleClicked,
    onRecenterMap,
    color,
    highlightColor,
    MarkerSlot,
    PopupSlot,
    TooltipSlot
  } = props;

  // recenter the map to focus on selected vehicle
  if (isTracked && onRecenterMap) {
    const { map } = useLeaflet();
    onRecenterMap(map, vehicle.lat, vehicle.lon);
  }

  return (
    <MarkerSlot
      zoom={zoom}
      vehicle={vehicle}
      isTracked={isTracked}
      onVehicleClicked={onVehicleClicked}
      color={color}
      highlightColor={highlightColor}
    >
      {PopupSlot && <PopupSlot vehicle={vehicle} isTracked={isTracked} />}
      {TooltipSlot && <TooltipSlot vehicle={vehicle} isTracked={isTracked} />}
    </MarkerSlot>
  );
}

VehicleGeometry.propTypes = {
  zoom: PropTypes.number.isRequired,
  vehicle: transitVehicleType.isRequired,
  isTracked: PropTypes.bool,

  /** Callback fired when the vehicle is clicked (vehicle: object) => {} */
  onVehicleClicked: PropTypes.func,

  /** will pan the map to the coordinates of the selected vehicle */
  onRecenterMap: PropTypes.func,

  /**
   * A custom leaflet marker component with the signature
   * ({vehicle: object, onVehicleClicked: (vehicle) => {}, children: Element}) => Element
   */
  MarkerSlot: PropTypes.func,

  /** popup and tooltip slot */
  PopupSlot: PropTypes.func,
  TooltipSlot: PropTypes.func,

  color: PropTypes.string,
  highlightColor: PropTypes.string
};

VehicleGeometry.defaultProps = {
  isTracked: false,
  onVehicleClicked: (vehicle, isTracked) => {
    linterIgnoreTheseProps(vehicle, isTracked);
  },
  onRecenterMap: null,
  MarkerSlot: ModeCircles,
  PopupSlot: null,
  TooltipSlot: null,
  color: "",
  highlightColor: ""
};
