import React from "react";

import ClassicModeIcon from "./classic-mode-icon";
import LegIconCore from "./leg-icon-core";
import TriMetModeIcon from "./trimet-mode-icon";
import TriMetModModeIcon from "./trimet-mod-mode-icon";

const LegIcon = ({ iconSet, ...props }) => {
  const iconSetLowerCase = iconSet.toLowerCase();
  let ModeIcon;
  if (iconSetLowerCase === "trimet") {
    ModeIcon = TriMetModeIcon;
  } else if (iconSetLowerCase === "trimet-mod") {
    ModeIcon = TriMetModModeIcon;
  } else {
    ModeIcon = ClassicModeIcon;
  }

  return <LegIconCore ModeIcon={ModeIcon} {...props} />;
};

export default LegIcon;
