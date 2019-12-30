import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";

import VehicleMarker from "./vehicle-marker";

function Vehicles(props) {
  const { vehicles } = props;

  return (
    <FeatureGroup id="vehicles fg">
      {vehicles && vehicles.map(v => <VehicleMarker key={v.id} vehicle={v} />)}
    </FeatureGroup>
  );
}

Vehicles.propTypes = {
  vehicles: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default Vehicles;
