import React from "react";
import PropTypes from "prop-types";

import { vehicleType } from "../types";
import { Button } from "./styled";

/**
 * view component for tracking button on marker popup
 */
function Tracker(props) {
  const { vehicle } = props;
  const { tracked } = props;
  const { setTracked } = props;

  function handleClick() {
    if (tracked) {
      setTracked(null, null);
    } else {
      setTracked(vehicle, null);
    }
  }

  function makeButtonText(isTracked) {
    return isTracked ? "Stop Tracking" : "Track Vehicle";
  }

  return (
    <Button onClick={handleClick}>{makeButtonText(tracked)}</Button>
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
