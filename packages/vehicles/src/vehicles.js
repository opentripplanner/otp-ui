import React from "react";
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

export default Vehicles;
