import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";

import VehicleMarker from "./vehicle-marker";
import VehicleGeometry from "./vehicle-geometry";

function VehicleLayer(props) {
  const { vehicles } = props;
  const { tracked } = props;

  return (
    <FeatureGroup id="vehicles fg">
      {vehicles && vehicles.map(v => <VehicleMarker key={v.id} vehicle={v} />)}
      <VehicleGeometry trackedVehicle={tracked} />
    </FeatureGroup>
  );
}

VehicleLayer.propTypes = {
  vehicles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tracked: PropTypes.shape({})
};

export default VehicleLayer;
