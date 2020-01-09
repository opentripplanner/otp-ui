import React from "react";
import PropTypes from "prop-types";

function makeButtonText(isTracked) {
  return isTracked ? "Track Vehicle" : "Stop Tracking";
}

function VehicleTracker(props) {
  const [buttonText, setButtonText] = React.useState(makeButtonText(false));

  const { vehicle } = props;
  const { isTracking } = props;
  const { setTracked } = props;

  function handleClick() {
    let tracked = false;
    if (vehicle) {
      if (isTracking(vehicle)) {
        setTracked(null);
      } else {
        tracked = setTracked(vehicle);
      }
    }
    setButtonText(makeButtonText(tracked));
  }

  return (
    <button type="button" onClick={e => handleClick(e)}>
      {buttonText}
    </button>
  );
}

VehicleTracker.propTypes = {
  vehicle: PropTypes.shape({}),
  isTracking: PropTypes.func.isRequired,
  setTracked: PropTypes.func.isRequired
};

VehicleTracker.defaultProps = {
  vehicle: null
};

export default VehicleTracker;
