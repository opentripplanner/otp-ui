import { legType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import { getCompanyIcon as defaultGetCompanyIcon } from "./companies";

const LegIcon = ({ getCompanyIcon, leg, ModeIcon, ...props }) => {
  let iconStr = leg.mode;
  if (iconStr === "CAR" && leg.rentedCar) {
    iconStr = leg.from.networks[0];
  } else if (iconStr === "CAR" && leg.tncData) {
    iconStr = leg.tncData.company;
  } else if (iconStr === "BICYCLE" && leg.rentedBike && leg.from.networks) {
    iconStr = leg.from.networks[0];
  } else if (
    iconStr === "MICROMOBILITY" &&
    leg.rentedVehicle &&
    leg.from.networks
  ) {
    iconStr = leg.from.networks[0];
  }

  // Check if the iconStr has a matching company icon. If so, return that.
  if (typeof getCompanyIcon === "function") {
    const CompanyIcon = getCompanyIcon(iconStr);
    if (CompanyIcon) return <CompanyIcon {...props} />;
  }

  // Do this for P&R, K&R and TNC trips without company icon
  if (iconStr && iconStr.startsWith("CAR")) iconStr = "CAR";

  return <ModeIcon mode={iconStr} {...props} />;
};

LegIcon.propTypes = {
  // Optional override function for deriving the company icon for a given leg.
  getCompanyIcon: PropTypes.func,
  leg: legType.isRequired,
  ModeIcon: PropTypes.elementType.isRequired
};

LegIcon.defaultProps = {
  getCompanyIcon: defaultGetCompanyIcon
};

export default LegIcon;
