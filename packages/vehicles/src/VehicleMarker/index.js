import React from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";

import L, { divIcon } from "leaflet";
import { Marker, withLeaflet } from "react-leaflet";
import RotatedMarker from "./RotatedMarker";

import VehiclePopup from "./popup";
import VehicleToolTip from "./tooltip";
import makeVehicleIcon from "./icons";
import { vehicleType } from "../types";
import * as Styled from "./styled";
import "./vehicles.css";

/**
 * This component demonstrates a custom marker used in the Vehicles overlay provided as
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

  makeCircleMarker(size) {
    const { vehicle } = this.props;
    const { hasTooltip } = this.props;
    const { hasPopup } = this.props;
    const { tracked } = this.props;
    const { setTracked } = this.props;

    const position = [vehicle.lat, vehicle.lon];
    const zPos = tracked ? 1000 : 0;

    const iconHtml = ReactDOMServer.renderToStaticMarkup(
      tracked ? (
        <Styled.TrackedVehicleCircle size={size} />
      ) : (
        <Styled.VehicleCircle size={size} />
      )
    );
    const icon = divIcon({ html: iconHtml, className: "" });

    return (
      <Marker icon={icon} position={position} zIndexOffset={zPos}>
        {hasPopup && (
          <VehiclePopup
            vehicle={vehicle}
            tracked={tracked}
            setTracked={setTracked}
          />
        )}
        {hasTooltip && L.Browser.mobile !== true && (
          <VehicleToolTip vehicle={vehicle} />
        )}
      </Marker>
    );
  }

  makeRotatedMarker() {
    const { vehicle } = this.props;
    const { hasTooltip } = this.props;
    const { hasPopup } = this.props;
    const { tracked } = this.props;
    const { setTracked } = this.props;

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
        {hasPopup && (
          <VehiclePopup
            vehicle={vehicle}
            tracked={tracked}
            setTracked={setTracked}
          />
        )}
        {hasTooltip && L.Browser.mobile !== true && (
          <VehicleToolTip vehicle={vehicle} />
        )}
      </RotatedMarker>
    );
  }

  makeMarker() {
    const { closeZoom, midZoom, farZoom } = this.props;
    const zoom = this.getZoom();
    if (zoom >= closeZoom) return this.makeRotatedMarker();
    if (zoom >= midZoom) return this.makeCircleMarker(13.0);
    if (zoom >= farZoom) return this.makeCircleMarker(7.0);
    return this.makeCircleMarker(4.0);
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

  hasTooltip: PropTypes.bool,
  hasPopup: PropTypes.bool,

  closeZoom: PropTypes.number,
  midZoom: PropTypes.number,
  farZoom: PropTypes.number
};

VehicleMarker.defaultProps = {
  tracked: false,
  vehicle: null,
  leaflet: null,
  hasTooltip: true,
  hasPopup: true,
  closeZoom: 14,
  midZoom: 12,
  farZoom: 9
};

export default withLeaflet(VehicleMarker);
