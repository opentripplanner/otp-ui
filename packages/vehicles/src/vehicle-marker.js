import React from "react";
import PropTypes from "prop-types";

import L, { divIcon } from "leaflet";
import { Marker, Popup, Tooltip, withLeaflet } from "react-leaflet";
import RotatedMarker from "./RotatedMarker"; // TODO: move to either base-map and/or utils and/or own npm & repo

import VehicleTracker from "./vehicle-tracker";
import makeVehicleIcon from "./vehicle-icons";
import { formatTime } from "./vehicle-utils";
import "../assets/vehicles.css";

/**
 * This component demonstrates a custom marker used in the SelectVehicles overlay provided as
 * an example. It is modeled after the component available in this file:
 * https://github.com/OpenTransitTools/transit-components/blob/master/lib/vehicles/VehicleMarker.js
 */
class VehicleMarker extends React.Component {
  getZoom() {
    let retVal = 15;
    try {
      const { leaflet } = this.props;
      retVal = leaflet.map.getZoom();
    } catch (e) {
      console.log(e);
    }
    return retVal;
  }

  makeToolTip() {
    const { vehicle } = this.props;

    let rsn = vehicle.routeShortName;
    if (rsn != null && rsn.length <= 3) {
      rsn = `Line ${rsn}`;
    }

    return (
      <Tooltip>
        <span>
          <b>{rsn}</b>: {formatTime(vehicle.seconds)}
        </span>
      </Tooltip>
    );
  }

  makePopup() {
    const { vehicle } = this.props;

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
          <VehicleTracker vehicle={vehicle} marker={this} /> <br />
        </div>
      </Popup>
    );
  }

  isTracking() {
    // const retVal = this.props.controller.isTrackingVehicle(this.props.vehicle);
    const retVal = false;
    return retVal;
  }

  makeCircleMarker(size) {
    const { vehicle } = this.props;

    const position = [vehicle.lat, vehicle.lon];
    let zPos = 0;

    let classnames = "vehicle-marker vehicle-circle";
    if (this.isTracking()) {
      classnames += " vehicle-circle-selected";
      zPos = 1000;
    }

    const icon = divIcon({
      className: classnames,
      iconSize: [size, size]
    });
    return (
      <Marker icon={icon} position={position} zIndexOffset={zPos}>
        {this.makePopup()}
        {L.Browser.mobile !== true && this.makeToolTip()}
      </Marker>
    );
  }

  makeRotatedMarker() {
    const { vehicle } = this.props;

    const position = [vehicle.lat, vehicle.lon];
    let zPos = 0;

    let heading = vehicle.heading;
    if (heading == null || heading < 0 || heading >= 360) {
      heading = 0;
    }

    let classnames = "vehicle-marker vehicle-icon";
    if (this.isTracking()) {
      classnames += " vehicle-icon-selected";
      zPos = 1000;
    }

    const icon = makeVehicleIcon(
      classnames,
      vehicle.routeType,
      vehicle.routeShortName
    );

    return (
      <RotatedMarker
        rotationAngle={heading}
        rotationOrigin="center center"
        icon={icon}
        position={position}
        zIndexOffset={zPos}
      >
        {this.makePopup()}
        {L.Browser.mobile !== true && this.makeToolTip()}
      </RotatedMarker>
    );
  }

  makeMarker() {
    const { closeZoom, midZoom, farZoom } = this.props;
    const zoom = this.getZoom();
    if (zoom >= closeZoom) return this.makeRotatedMarker();
    if (zoom >= midZoom) return this.makeCircleMarker(13.0);
    if (zoom >= farZoom) return this.makeCircleMarker(9.0);
    return this.makeCircleMarker(5.0);
  }

  render() {
    return this.makeMarker();
  }
}

VehicleMarker.propTypes = {
  vehicle: PropTypes.shape({
    routeShortName: PropTypes.string,
    routeLongName: PropTypes.string,
    routeType: PropTypes.string,

    status: PropTypes.string,
    reportDate: PropTypes.string,
    seconds: PropTypes.number,

    stopSequence: PropTypes.number,
    stopId: PropTypes.string,
    vehicleId: PropTypes.string,
    tripId: PropTypes.string,
    blockId: PropTypes.string,

    lat: PropTypes.number,
    lon: PropTypes.number,
    heading: PropTypes.number
  }),
  leaflet: PropTypes.shape({
    map: PropTypes.shape({
      getZoom: PropTypes.shape({})
    })
  }),

  closeZoom: PropTypes.number,
  midZoom: PropTypes.number,
  farZoom: PropTypes.number
};

VehicleMarker.defaultProps = {
  vehicle: null,
  leaflet: null,
  closeZoom: 14,
  midZoom: 12,
  farZoom: 9
};

export default withLeaflet(VehicleMarker);
