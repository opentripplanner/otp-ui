import { legType } from "@opentripplanner/core-utils/lib/types";
import React from "react";

import { getCompanyIcon } from "./companies";
import TriMetModeIcon from "./trimet-mode-icon";

const TriMetLegIcon = ({ leg, ...props }) => {
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
  if (leg.routeLongName && leg.routeLongName.startsWith("Portland Streetcar")) {
    iconStr = "STREETCAR";
  } else if (leg.rentedBike) {
    iconStr = "BICYCLE";
  }

  // try to see if the iconStr has a matching company icon. If so, return that.
  const CompanyIcon = getCompanyIcon(iconStr);
  if (CompanyIcon) return <CompanyIcon {...props} />;

  // Do this for P&R, K&R and TNC trips without company icon
  if (iconStr && iconStr.startsWith("CAR")) iconStr = "CAR";

  return <TriMetModeIcon label={iconStr} {...props} />;
};

TriMetLegIcon.propTypes = {
  leg: legType.isRequired
};

export default TriMetLegIcon;
