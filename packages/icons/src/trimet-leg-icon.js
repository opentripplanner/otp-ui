import React from "react";

import LegIconCore from "./leg-icon-core";
import TriMetModeIcon from "./trimet-mode-icon";

const TriMetLegIcon = props => (
  <LegIconCore ModeIcon={TriMetModeIcon} {...props} />
);

export default TriMetLegIcon;
