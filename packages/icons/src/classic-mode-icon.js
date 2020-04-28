import React from "react";

import {
  ClassicBike,
  ClassicBus,
  ClassicCar,
  ClassicFerry,
  ClassicGondola,
  ClassicMicromobility,
  ClassicTram,
  ClassicWalk
} from "./classic";

function ClassicModeIcon({ label, ...props }) {
  if (!label) return null;
  switch (label.toLowerCase()) {
    case "bus":
      return <ClassicBus {...props} />;
    case "tram":
    case "rail":
    case "subway":
      return <ClassicTram {...props} />;
    case "walk":
      return <ClassicWalk {...props} />;
    case "bicycle":
    case "bicycle_rent":
      return <ClassicBike {...props} />;
    case "ferry":
      return <ClassicFerry {...props} />;
    case "gondola":
      return <ClassicGondola {...props} />;
    case "car":
      return <ClassicCar {...props} />;
    case "micromobility":
    case "micromobility_rent":
      return <ClassicMicromobility {...props} />;
    default:
      return null;
  }
}

export default ClassicModeIcon;
