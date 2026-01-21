import React from "react";

import coreUtils from "@opentripplanner/core-utils";
import LegIcon from "./leg-icon";
import TriMetModeIcon from "./trimet-mode-icon";
import BiketownIcon from "./companies/biketown-icon";

const { getLegRouteLongName } = coreUtils.itinerary;

const TriMetLegIcon = ({ leg, ...props }) => {
  // Custom TriMet icon logic
  const routeLongName = getLegRouteLongName(leg);
  if (routeLongName && routeLongName.startsWith("Portland Streetcar")) {
    return <TriMetModeIcon mode="STREETCAR" {...props} />;
  }
  if (leg.rentedBike) {
    if (leg.from.networks && leg.from.networks[0] === "GBFS") {
      return <BiketownIcon {...props} />;
    }
    return <TriMetModeIcon mode="BICYCLE" {...props} />;
  }

  return <LegIcon leg={leg} ModeIcon={TriMetModeIcon} {...props} />;
};

export default TriMetLegIcon;
