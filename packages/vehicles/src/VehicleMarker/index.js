import React from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";

import L, { divIcon } from "leaflet";
import { withLeaflet } from "react-leaflet";
import RotatedMarker from "./RotatedMarker";

import VehiclePopup from "./popup";
import VehicleToolTip from "./tooltip";
import makeVehicleIcon from "./icons";
import { vehicleType } from "../types";
import * as Styled from "./styled";

/**
 * This component demonstrates a custom marker used in the Vehicles overlay provided as
 * an example. It is modeled after the component available in this file:
 * https://github.com/OpenTransitTools/transit-components/blob/master/lib/vehicles/VehicleMarker.js
 */
function VehicleMarker(props) {
  const { vehicle } = props;
  const { hasTooltip } = props;
  const { hasPopup } = props;
  const { tracked } = props;
  const { setTracked } = props;
  const { leaflet } = props;

  function getZoom() {
    let retVal = 15;
    try {
      retVal = leaflet.map.getZoom();
    } catch (e) {
      console.log(e);
    }
    return retVal;
  }

  function checkHeading(heading) {
    if (heading === null || heading < 0 || heading >= 360) {
      heading = 0;
    }
    return heading;
  }

  function makeCircleMarker(size) {
    const position = [vehicle.lat, vehicle.lon];
    const zPos = tracked ? 1000 : 0;
    const heading = checkHeading(vehicle.heading);

    const iconHtml = ReactDOMServer.renderToStaticMarkup(
      tracked ? (
        <Styled.TrackedVehicleCircle size={size} />
      ) : (
        <Styled.VehicleCircle size={size} />
      )
    );
    const icon = divIcon({ html: iconHtml, className: "" });

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

  function makeRotatedMarker() {
    const position = [vehicle.lat, vehicle.lon];
    const zPos = tracked ? 1000 : 0;
    const heading = checkHeading(vehicle.heading);
    const icon = makeVehicleIcon(vehicle.routeType);

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

  const { closeZoom, midZoom, farZoom } = props;
  const zoom = getZoom();
  if (zoom >= closeZoom) return makeRotatedMarker();
  if (zoom >= midZoom) return makeCircleMarker(13.0);
  if (zoom >= farZoom) return makeCircleMarker(7.0);
  return makeCircleMarker(4.0);
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
