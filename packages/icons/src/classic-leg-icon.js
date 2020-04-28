import React from "react";

import LegIcon from "./leg-icon";
import ClassicModeIcon from "./classic-mode-icon";

const ClassicLegIcon = props => {
  return <LegIcon ModeIcon={ClassicModeIcon} {...props} />;
};

export default ClassicLegIcon;
