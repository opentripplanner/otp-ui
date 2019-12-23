/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import { Circle, Popup, Tooltip, withLeaflet } from "react-leaflet";

/**
 * This component demonstrates a custom marker used in the SelectVehicles overlay provided as an example.
 * It is modeled after the component available in this file:
 * https://github.com/OpenTransitTools/transit-components/blob/master/lib/vehicles/VehicleMarker.js
 */
class VehicleMarker extends React.Component {
  getLastReportDate(v) {
    return `${v.seconds} seconds ago`;
  }

  makeToolTip() {
    const v = this.props.vehicle;

    return (
      <Tooltip>
        <span>
          <b>{v.routeShortName}</b>: {this.getLastReportDate(v)}
        </span>
      </Tooltip>
    );
  }

  makePopup() {
    const v = this.props.vehicle;

    let status = "unknown";
    if (v.status === "IN_TRANSIT_TO") status = "en-route to stop ";
    else if (v.status === "STOPPED_AT")
      if (v.stopSequence === 1) status = "beginning route from stop ";
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
          <span>Last reported: {this.getLastReportDate(v)}</span>
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
          <br />
        </div>
      </Popup>
    );
  }

  render() {
    const v = this.props.vehicle;
    const position = [v.lat, v.lon];

    return (
      <Circle center={position} radius={100} color="black">
        {this.makePopup()}
        {this.makeToolTip()}
      </Circle>
    );
  }
}

export default withLeaflet(VehicleMarker);
