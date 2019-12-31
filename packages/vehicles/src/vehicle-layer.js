import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";

import VehicleMarker from "./vehicle-marker";

function VehicleLayer(props) {
  const { vehicles } = props;

  return (
    <FeatureGroup id="vehicles fg">
      {vehicles && vehicles.map(v => <VehicleMarker key={v.id} vehicle={v} />)}
    </FeatureGroup>
  );
}

VehicleLayer.propTypes = {
  vehicles: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default VehicleLayer;
