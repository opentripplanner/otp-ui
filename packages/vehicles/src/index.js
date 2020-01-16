import React from "react";

import VehicleAction from "./vehicle-action";

function Vehicles() {
  return <VehicleAction />;
}

Vehicles.defaultProps = {
  actionTypes: null
};

Vehicles.propTypes = {
  actionTypes: VehicleAction.propTypes
};

export default Vehicles;
