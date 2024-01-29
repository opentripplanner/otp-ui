import React from "react";

import { ClassicGondola } from "../classic";
import ClassicModeIcon from "../classic-mode-icon";

function CustomModeIcon({ mode, leg, ...props }) {
  if (!mode) return null;
  if (leg?.routeId === "TriMet:100") return <ClassicGondola {...props} />;
  return <ClassicModeIcon mode={mode} leg={leg} props={props} />;
}

export default CustomModeIcon;
