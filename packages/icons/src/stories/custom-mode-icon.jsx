import React from "react";

import { ClassicGondola } from "../classic";
import ClassicModeIcon from "../classic-mode-icon";

function CustomModeIcon({ leg, mode, ...props }) {
  if (!mode) return null;
  if (leg?.routeId === "TriMet:100") return <ClassicGondola {...props} />;
  return <ClassicModeIcon leg={leg} mode={mode} props={props} />;
}

export default CustomModeIcon;
