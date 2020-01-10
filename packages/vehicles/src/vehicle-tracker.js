import React from "react";
import PropTypes from "prop-types";

import { vehicleType } from "./types";

function makeButtonText(tracked) {
  return tracked ? "Stop Tracking" : "Track Vehicle";
}

function VehicleTracker(props) {
  const { vehicle } = props;
  const { tracked } = props;
  const { setTracked } = props;

  function handleClick() {
    if (tracked) {
      setTracked(null);
    } else {
      setTracked(vehicle);
    }
  }

  return (
    <button type="button" onClick={e => handleClick(e)}>
      {makeButtonText(tracked)}
    </button>
  );
}

VehicleTracker.propTypes = {
  vehicle: vehicleType,
  tracked: PropTypes.bool,
  setTracked: PropTypes.func.isRequired
};

VehicleTracker.defaultProps = {
  vehicle: null,
  tracked: false
};

export default VehicleTracker;
