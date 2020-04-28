import React from "react";

import LegIconCore from "./leg-icon-core";
import ClassicModeIcon from "./classic-mode-icon";

const ClassicLegIcon = props => (
  <LegIconCore ModeIcon={ClassicModeIcon} {...props} />
);

export default ClassicLegIcon;
