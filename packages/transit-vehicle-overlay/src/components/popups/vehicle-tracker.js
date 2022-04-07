// Removed as core-utils is typescripted. TODO: Remove when typescripting!
/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";

import * as S from "./styled";

/**
 * presentational component for tracking button on marker popup
 */
export default function VehicleTracker(props) {
  const { vehicle, isTracked, setTracked } = props;
  const text = isTracked ? "Stop Tracking" : "Track Vehicle";
  const cls = isTracked ? "active" : "";

  const handleClick = () => {
    setTracked(vehicle, isTracked);
  };

  return (
    <S.PopupStyle.Button onClick={handleClick} className={cls}>
      {text}
    </S.PopupStyle.Button>
  );
}

VehicleTracker.propTypes = {
  /** vehicle record - @see: core-utils/types/transitVehicleType */
  // vehicle: coreUtils.types.transitVehicleType,
  vehicle: PropTypes.object,

  /** tracking state for this vehicle (marker) .. determines button content */
  isTracked: PropTypes.bool,

  /** callback for when the button is triggered ... cb(vehicle, isTracked); */
  setTracked: PropTypes.func.isRequired
};

VehicleTracker.defaultProps = {
  vehicle: null,
  isTracked: false
};

// Rename styled components for export
export { S as Styled };
