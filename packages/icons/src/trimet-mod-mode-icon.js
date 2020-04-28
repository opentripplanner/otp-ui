import React from "react";

import { ClassicCar, ClassicFerry, ClassicMicromobility } from "./classic";
import { ModBike, ModBus, ModGondola, ModTram, ModWalk } from "./mod";

function TriMetModModeIcon({ label, ...props }) {
  if (!label) return null;
  switch (label.toLowerCase()) {
    case "bus":
      return <ModBus {...props} />;
    case "tram":
    case "rail":
    case "subway":
      return <ModTram {...props} />;
    case "walk":
      return <ModWalk {...props} />;
    case "bicycle":
    case "bicycle_rent":
      return <ModBike {...props} />;
    case "ferry":
      return <ClassicFerry {...props} />;
    case "gondola":
      return <ModGondola {...props} />;
    case "car":
      return <ClassicCar {...props} />;
    case "micromobility":
    case "micromobility_rent":
      return <ClassicMicromobility {...props} />;
    default:
      return null;
  }
}

export default TriMetModModeIcon;
