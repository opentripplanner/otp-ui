import React from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";

import L, { divIcon } from "leaflet";
import { withLeaflet } from "react-leaflet";
import RotatedMarker from "./RotatedMarker";

import VehiclePopup from "./popup";
import VehicleToolTip from "./tooltip";
import { vehicleType } from "../types";
import * as utils from "../utils";
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
  const { color } = props;

  const { leaflet } = props;

  const { closeZoom, midZoom } = props;
  const { midSize, farSize } = props;

  const position = [vehicle.lat, vehicle.lon];
  const zPos = tracked ? 1000 : 0;
  const heading = utils.checkHeading(vehicle.heading);

  function makeIcon() {
    const zoom = utils.getZoom(leaflet);

    let icon = null;
    if (zoom >= closeZoom) {
      icon = Styled.makeVehicleIcon(vehicle.routeType, color, tracked);
    } else {
      const size = zoom >= midZoom ? midSize : farSize;
      const iconHtml = ReactDOMServer.renderToStaticMarkup(
        tracked ? (
          <Styled.TrackedVehicleCircle size={size} colorSelected={color} />
        ) : (
          <Styled.VehicleCircle size={size} colorSelected={color} />
        )
      );
      icon = divIcon({ className: "", html: iconHtml });
    }

    return icon;
  }

  const icon = makeIcon();
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

VehicleMarker.defaultProps = {
  color: "#00bfff",
  tracked: false,
  vehicle: null,
  leaflet: null,
  hasTooltip: true,
  hasPopup: true,

  closeZoom: 14,
  midZoom: 12,

  midSize: 13.0,
  farSize: 7.0
};

VehicleMarker.propTypes = {
  color: PropTypes.string,
  tracked: PropTypes.bool,
  setTracked: PropTypes.func.isRequired,
  vehicle: vehicleType,

  leaflet: PropTypes.shape({
    map: PropTypes.shape({
      getZoom: PropTypes.func
    })
  }),

  hasTooltip: PropTypes.bool,
  hasPopup: PropTypes.bool,

  closeZoom: PropTypes.number,
  midZoom: PropTypes.number,

  midSize: PropTypes.number,
  farSize: PropTypes.number
};

export default withLeaflet(VehicleMarker);
