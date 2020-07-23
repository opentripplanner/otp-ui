import React from "react";
import PropTypes from "prop-types";
import { useLeaflet } from "react-leaflet";

import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import { linterIgnoreTheseProps } from "../../utils";

/**
 * presentational component for rendering transit vehicle positions atop a map
 * will show both point positions for a collection of vehicles, as well as being
 * able to render a 'selected' vehicle
 */
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
    // TODO: very leaflet specific - e.g., mb geo
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
  /** map zoom: is part of the props due to redrawing this layer on map zoom */
  zoom: PropTypes.number.isRequired,

  /** required vehicle record for the vehicle */
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
  MarkerSlot: PropTypes.func.isRequired,

  /** optional / customizable popup slot */
  PopupSlot: PropTypes.func,

  /** optional / customizable tooltip slot */
  TooltipSlot: PropTypes.func,

  /** fill color of a vehicle */
  color: PropTypes.string,

  /** fill color of a tracked vehicle (see isTracked above) */
  highlightColor: PropTypes.string
};

VehicleGeometry.defaultProps = {
  isTracked: false,
  onVehicleClicked: (vehicle, isTracked) => {
    linterIgnoreTheseProps(vehicle, isTracked);
  },
  onRecenterMap: null,
  PopupSlot: null,
  TooltipSlot: null,
  color: "",
  highlightColor: ""
};
