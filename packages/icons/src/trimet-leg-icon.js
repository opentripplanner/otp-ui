import React from "react";

import LegIcon from "./leg-icon";
import TriMetModeIcon from "./trimet-mode-icon";

const TriMetLegIcon = props => {
  return <LegIcon ModeIcon={TriMetModeIcon} {...props} />;
};

export default TriMetLegIcon;
