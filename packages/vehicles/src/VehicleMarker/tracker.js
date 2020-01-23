import React from "react";
import PropTypes from "prop-types";

import { vehicleType } from "../types";

function Tracker(props) {
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

  function makeButtonText(isTracked) {
    return isTracked ? "Stop Tracking" : "Track Vehicle";
  }

  return (
    <button type="button" onClick={e => handleClick(e)}>
      {makeButtonText(tracked)}
    </button>
  );
}

Tracker.propTypes = {
  vehicle: vehicleType,
  tracked: PropTypes.bool,
  setTracked: PropTypes.func.isRequired
};

Tracker.defaultProps = {
  vehicle: null,
  tracked: false
};

export default Tracker;
