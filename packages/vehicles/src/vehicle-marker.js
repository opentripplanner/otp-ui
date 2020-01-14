import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import L, { divIcon } from "leaflet";
import { Marker, Popup, Tooltip, withLeaflet } from "react-leaflet";
import RotatedMarker from "./RotatedMarker"; // TODO: move to either base-map and/or utils and/or own npm & repo

import { vehicleType } from "./types";

import VehicleTracker from "./vehicle-tracker";
import makeVehicleIcon from "./vehicle-icons";
import { formatTime } from "./vehicle-utils";
import "../assets/vehicles.css";

const VehicleCircle = styled.div`
  background: #000000; /* color of the circle */
  border-radius: 50%; /* make the div a circular shape */
  box-shadow: 4px 4px 3px grey; /* see http://www.w3schools.com/css/css3_shadows.asp */
  -moz-box-shadow: 4px 4px 3px grey;
  -webkit-box-shadow: 4px 4px 3px grey;
`;

const VehicleCircleSelected = styled(VehicleCircle)`
  background-color: #00bfff;
`;

const VehicleIcon = styled.div`
  border-radius: 15px!important;
  background-color: #FFF;
  border: 1px solid #FFF;
`;

const VehicleIconSelected = styled(VehicleIcon)`
  background-color: #00bfff;
  border: 1px solid #00bfff;
`;

const VehicleIconHover = styled(VehicleIconSelected)`
  background-color: #00bfff;
  border: 1px solid #ccee77;
`;

/**
const getStationMarkerByColor = memoize(color =>
  divIcon({
    className: "",
    iconSize: [11, 16],
    popupAnchor: [0, -6],
    html: ReactDOMServer.renderToStaticMarkup(
      <Styled.StationMarker color={color} />
    )
  })
);

 export const hubIcons = Styled.hubIcons.map(StyledIcon =>
  divIcon({
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -12],
    html: ReactDOMServer.renderToStaticMarkup(<StyledIcon />),
    className: ""
  });

export const floatingBikeIcon = divIcon({
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -12],
  html: ReactDOMServer.renderToStaticMarkup(<Styled.OutOfHubBikeIcon />),
  className: ""
});

 */

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
    const { tracked } = this.props;
    const { setTracked } = this.props;

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

  makeCircleMarker(size) {
    const { vehicle } = this.props;
    const { tracked } = this.props;

    const position = [vehicle.lat, vehicle.lon];
    let zPos = 0;

    let classnames = "vehicle-marker vehicle-circle";
    if (tracked) {
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
    const { tracked } = this.props;

    const position = [vehicle.lat, vehicle.lon];
    let zPos = 0;

    let heading = vehicle.heading;
    if (heading == null || heading < 0 || heading >= 360) {
      heading = 0;
    }

    let classnames = "vehicle-marker vehicle-icon";
    if (tracked) {
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
  tracked: PropTypes.bool,
  setTracked: PropTypes.func.isRequired,
  vehicle: vehicleType,

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
  tracked: false,
  vehicle: null,
  leaflet: null,
  closeZoom: 14,
  midZoom: 12,
  farZoom: 9
};

export default withLeaflet(VehicleMarker);
