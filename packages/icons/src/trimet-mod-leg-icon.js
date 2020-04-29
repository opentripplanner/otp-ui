import React from "react";

import LegIcon from "./leg-icon";
import TriMetModModeIcon from "./trimet-mod-mode-icon";

const TriMetModLegIcon = props => (
  <LegIcon ModeIcon={TriMetModModeIcon} {...props} />
);

export default TriMetModLegIcon;
