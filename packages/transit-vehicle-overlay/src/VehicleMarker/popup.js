import React from "react";
import { Popup } from "react-leaflet";
import PropTypes from "prop-types";
import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";

import VehicleTracker from "./tracker";
import { formatTime } from "../utils";

/**
 * view component for vehicle marker popup
 */
function VehiclePopup(props) {
  const { vehicle, tracked, setTracked } = props;

  let status = "unknown";
  if (vehicle.status === "IN_TRANSIT_TO") {
    status = "en-route to stop ";
  } else if (vehicle.status === "STOPPED_AT") {
    if (vehicle.stopSequence === 1) {
      status = "beginning route from stop ";
    } else {
      status = "stopped at ";
    }
  }

  let vid = "";
  if (vehicle.vehicleId.indexOf("+") > 0) {
    vid = `Vehicles: ${vehicle.vehicleId.replace(/\+/g, ", ")}`;
  } else {
    vid = `Vehicle: ${vehicle.vehicleId}`;
  }

  const stopLink = `https://trimet.org/ride/stop.html?stop_id=${vehicle.stopId}`;

  return (
    <Popup>
      <div>
        <span>
          <b>{vehicle.routeLongName}</b>
        </span>
        <br />
        <span>Last reported: {formatTime(vehicle.seconds)}</span>
        <br />
        <span>Report date: {vehicle.reportDate}</span>
        <br />
        <span>
          Status: {status}{" "}
          <a target="#" href={stopLink}>
            {vehicle.stopId}
          </a>
        </span>
        <br />
        <span>
          Trip: {vehicle.tripId}, Block: {vehicle.blockId}
        </span>
        <br />
        <span>{vid}</span> <br />
        <VehicleTracker
          vehicle={vehicle}
          tracked={tracked}
          setTracked={setTracked}
        />
        <br />
      </div>
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
