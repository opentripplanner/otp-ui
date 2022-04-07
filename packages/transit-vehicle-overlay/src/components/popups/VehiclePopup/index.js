// Removed as core-utils is typescripted. TODO: Remove when typescripting!
/* eslint-disable react/forbid-prop-types */
import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import PropTypes from "prop-types";
import { Popup } from "react-leaflet";

import { PopupStyle } from "../styled";
import VehicleTracker from "../vehicle-tracker";
import { linterIgnoreTheseProps } from "../../../utils";

const { formatDurationWithSeconds } = coreUtils.time;

/**
 * view component for vehicle marker popup
 * content is derived from the vehicle record
 */
export default function VehiclePopup(props) {
  const { vehicle, isTracked, setTracked } = props;

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
          isTracked={isTracked}
          setTracked={setTracked}
        />
      </PopupStyle>
    </Popup>
  );
}

VehiclePopup.propTypes = {
  /** vehicle record - @see: core-utils/types/transitVehicleType */
  // vehicle: coreUtils.types.transitVehicleType,
  vehicle: PropTypes.object,

  /** indicate if this vehicle is being tracked, */
  isTracked: PropTypes.bool,

  /** callback which forwards the vehicle and tracking status from track button */
  setTracked: PropTypes.func
};

VehiclePopup.defaultProps = {
  vehicle: null,
  isTracked: false,
  setTracked: (vehicle, isTracked) => {
    linterIgnoreTheseProps(vehicle, isTracked);
  }
};
