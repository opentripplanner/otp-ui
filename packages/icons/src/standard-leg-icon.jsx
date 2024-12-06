import React from "react";

import LegIcon from "./leg-icon";
import StandardModeIcon from "./standard-mode-icon";

const StandardLegIcon = props => (
  <LegIcon ModeIcon={StandardModeIcon} {...props} />
);

export default StandardLegIcon;
