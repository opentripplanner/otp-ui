import React from "react";
// import PropTypes from "prop-types";

// import VehicleLayer from "./vehicle-layer";
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
