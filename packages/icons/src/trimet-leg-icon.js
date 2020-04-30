import React from "react";

import LegIcon from "./leg-icon";
import TriMetModeIcon from "./trimet-mode-icon";
import BiketownIcon from "./companies/biketown-icon";

const TriMetLegIcon = ({ leg, ModeIcon, ...props }) => {
  // Custom TriMet icon logic.
  if (leg.routeLongName && leg.routeLongName.startsWith("Portland Streetcar")) {
    return <TriMetModeIcon mode="STREETCAR" {...props} />;
  }
  if (leg.rentedBike) {
    if (leg.from.networks && leg.from.networks[0] === "GBFS") {
      return <BiketownIcon {...props} />;
    }
    return <TriMetModeIcon mode="BICYCLE" {...props} />;
  }

  return <LegIcon ModeIcon={TriMetModeIcon} {...props} />;
};

export default TriMetLegIcon;
