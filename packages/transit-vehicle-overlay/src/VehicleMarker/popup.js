import React from "react";
import { Popup } from "react-leaflet";
import PropTypes from "prop-types";
import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import { formatDurationWithSeconds } from "@opentripplanner/core-utils/lib/time";

import { PopupStyle } from "./styled";
import VehicleTracker from "./tracker";

/**
 * view component for vehicle marker popup
 */
function VehiclePopup(props) {
  const { vehicle, tracked, setTracked } = props;

  let status = "unknown";
  if (vehicle.status === "IN_TRANSIT_TO") {
    status = `en-route to stop #${vehicle.stopId}`;
  } else if (vehicle.status === "STOPPED_AT") {
    if (vehicle.stopSequence === 1) {
      status = `start route at stop #${vehicle.stopId}`;
    } else {
      status = `at stop #${vehicle.stopId}`;
    }
  }

  let vid = "";
  if (vehicle.vehicleId.indexOf("+") > 0) {
    vid = `Vehicles: ${vehicle.vehicleId.replace(/\+/g, ", ")}`;
  } else {
    vid = `Vehicle: ${vehicle.vehicleId}`;
  }

  return (
    <Popup>
      <PopupStyle>
        <PopupStyle.Title>{vehicle.routeLongName}</PopupStyle.Title>
        <PopupStyle.Span>
          Last seen: {formatDurationWithSeconds(vehicle.seconds)} ago
        </PopupStyle.Span>
        <PopupStyle.Span>Date: {vehicle.reportDate}</PopupStyle.Span>
        <PopupStyle.Span>Status: {status} </PopupStyle.Span>
        <PopupStyle.Span>
          Trip: {vehicle.tripId}, Block: {vehicle.blockId}
        </PopupStyle.Span>
        <PopupStyle.Span>{vid}</PopupStyle.Span>
        <VehicleTracker
          vehicle={vehicle}
          tracked={tracked}
          setTracked={setTracked}
        />
      </PopupStyle>
    </Popup>
  );
}

VehiclePopup.defaultProps = {
  vehicle: null,
  tracked: null
};

VehiclePopup.propTypes = {
  vehicle: transitVehicleType,
  tracked: PropTypes.bool,
  setTracked: PropTypes.func.isRequired
};

export default VehiclePopup;
