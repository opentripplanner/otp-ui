import React from "react";
import PropTypes from "prop-types";

function getButtonText(isTracked) {
  return isTracked ? "Track Vehicle" : "Stop Tracking";
}

function VehicleTracker(props) {
  const [buttonText, setButtonText] = React.useState(getButtonText(false));
  const { vehicle } = props;

  function isTracking() {
    let retVal = false;

    if (vehicle === null) retVal = false;

    // TODO remove this
    if (buttonText === getButtonText(false)) retVal = true;

    return retVal;
  }

  function handleClick() {
    const txt = getButtonText(isTracking());
    setButtonText(txt);
  }

  return (
    <button type="button" onClick={e => handleClick(e)}>
      {buttonText}
    </button>
  );
}

VehicleTracker.propTypes = {
  vehicle: PropTypes.shape({}),
  marker: PropTypes.shape({})
};

VehicleTracker.defaultProps = {
  vehicle: null,
  marker: null
};

export default VehicleTracker;
