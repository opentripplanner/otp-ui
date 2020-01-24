import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";

import { vehicleType } from "../types";
import VehicleMarker from "../VehicleMarker";

function VehicleLayer(props) {
  const { vehicles } = props;
  const { trackedVehicle } = props;

  function isTracking(v) {
    let retVal = false;
    if (
      trackedVehicle &&
      v &&
      v.vehicleId &&
      v.vehicleId === trackedVehicle.vehicleId
    ) {
      retVal = true;
    }
    return retVal;
  }

  return (
    <FeatureGroup id="vehicles fg">
      {vehicles &&
        vehicles.map(v => (
          <VehicleMarker
            key={v.id}
            vehicle={v}
            tracked={isTracking(v)}
            setTracked={props.setTracked}
          />
        ))}
    </FeatureGroup>
  );
}

VehicleLayer.defaultProps = {
  vehicles: [],
  trackedVehicle: null
};

VehicleLayer.propTypes = {
  vehicles: PropTypes.arrayOf(vehicleType),
  trackedVehicle: vehicleType,
  setTracked: PropTypes.func.isRequired
};

export default VehicleLayer;
