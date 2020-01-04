/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import { divIcon } from "leaflet";
import {
  Marker,
  CircleMarker,
  Popup,
  Tooltip,
  withLeaflet
} from "react-leaflet";

import RotatedMarker from "./RotatedMarker"; // TODO: move to either base-map and/or utils and/or own npm & repo

import VehicleGeometry from "./vehicle-geometry";
import makeVehicleIcon from "./vehicle-icons";
import { formatTime } from "./vehicle-utils";
import "../assets/vehicles.css";

/**
 * This component demonstrates a custom marker used in the SelectVehicles overlay provided as an example.
 * It is modeled after the component available in this file:
 * https://github.com/OpenTransitTools/transit-components/blob/master/lib/vehicles/VehicleMarker.js
 */
class VehicleMarker extends React.Component {
  makeToolTip() {
    const v = this.props.vehicle;

    let rsn = v.routeShortName;
    if (rsn != null && rsn.length <= 3) rsn = `Line ${rsn}`;

    return (
      <Tooltip>
        <span>
          <b>{rsn}</b>: {formatTime(v.seconds)}
        </span>
      </Tooltip>
    );
  }

  makePopup() {
    const v = this.props.vehicle;

    let status = "unknown";
    if (v.status == "IN_TRANSIT_TO") status = "en-route to stop ";
    else if (v.status == "STOPPED_AT")
      if (v.stopSequence == 1) status = "beginning route from stop ";
      else status = "stopped at ";

    let vehicle = "";
    if (v.vehicleId.indexOf("+") > 0)
      vehicle = `Vehicles: ${v.vehicleId.replace(/\+/g, ", ")}`;
    else vehicle = `Vehicle: ${v.vehicleId}`;

    const stopLink = `https://trimet.org/ride/stop.html?stop_id=${v.stopId}`;

    return (
      <Popup>
        <div>
          <span>
            <b>{v.routeLongName}</b>
          </span>
          <br />
          <span>Last reported: {formatTime(v.seconds)}</span>
          <br />
          <span>Report date: {v.reportDate}</span>
          <br />
          <span>
            Status: {status}{" "}
            <a target="#" href={stopLink}>
              {v.stopId}
            </a>
          </span>
          <br />
          <span>
            Trip: {v.tripId}, Block: {v.blockId}
          </span>
          <br />
          <span>{vehicle}</span> <br />
        </div>
      </Popup>
    );
    // <VehicleTracker vehicle={v} marker={this} controller={this.props.controller} />  <br/>
  }

  isTracking() {
    // const retVal = this.props.controller.isTrackingVehicle(this.props.vehicle);
    const retVal = false;
    return retVal;
  }

  makeCircleMarker(size) {
    const v = this.props.vehicle;

    const position = [v.lat, v.lon];
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
    const v = this.props.vehicle;

    const position = [v.lat, v.lon];
    let zPos = 0;

    // let heading = Math.abs(v.heading / 2); // NOTE: added this div by 2 from strange otp-ui crap
    let heading = v.heading;
    if (heading == null || heading < 0 || heading >= 360) heading = 0;

    let classnames = "vehicle-marker vehicle-icon";
    if (this.isTracking()) {
      classnames += " vehicle-icon-selected";
      zPos = 1000;
    }

    const icon = makeVehicleIcon(classnames, v.routeType, v.routeShortName);

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

  getZoom() {
    let retVal = 15;
    try {
      const zoom = this.props.leaflet.map.getZoom();
      retVal = zoom;
    } catch (e) {
      console.log(e);
    }
    return retVal;
  }

  makeMarker() {
    const zoom = this.getZoom();
    const closeZoom = this.props.closeZoom || 14;
    const midZoom = this.props.midZoom || 12;
    const farZoom = this.props.farZoom || 9;

    if (zoom >= closeZoom) return this.makeRotatedMarker();
    if (zoom >= midZoom) return this.makeCircleMarker(13.0);
    if (zoom >= farZoom) return this.makeCircleMarker(9.0);
    return this.makeCircleMarker(5.0);
  }

  render() {
    return this.makeMarker();
  }
}

export default withLeaflet(VehicleMarker);
