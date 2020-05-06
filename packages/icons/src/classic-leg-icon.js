import React from "react";

import LegIcon from "./leg-icon";
import ClassicModeIcon from "./classic-mode-icon";

const ClassicLegIcon = props => (
  <LegIcon ModeIcon={ClassicModeIcon} {...props} />
);

export default ClassicLegIcon;
