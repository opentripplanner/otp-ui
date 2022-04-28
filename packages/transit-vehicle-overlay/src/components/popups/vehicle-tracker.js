import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

import { defaultMessages } from "../../utils";

import * as S from "./styled";

/**
 * presentational component for tracking button on marker popup
 */
export default function VehicleTracker({ vehicle, isTracked, setTracked }) {
  const text = isTracked ? (
    <FormattedMessage
      defaultMessage={defaultMessages["otpUi.TransitVehicleOverlay.trackStop"]}
      description="Prompt to stop tracking a vehicle."
      id="otpUi.TransitVehicleOverlay.trackStop"
    />
  ) : (
    <FormattedMessage
      defaultMessage={defaultMessages["otpUi.TransitVehicleOverlay.trackStart"]}
      description="Prompt to start tracking a vehicle."
      id="otpUi.TransitVehicleOverlay.trackStart"
    />
  );
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
  vehicle: coreUtils.types.transitVehicleType,

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
