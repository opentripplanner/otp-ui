import React from "react";

import AerialTram from "./trimet/AerialTram";
import Bicycle from "./trimet/Bicycle";
import Bus from "./trimet/Bus";
import Car from "./trimet/Car";
import Ferry from "./trimet/Ferry";
import Max from "./trimet/Max";
import Micromobility from "./trimet/Micromobility";
import Walk from "./trimet/Walk";

function TriMetModeIcon({ label, ...props }) {
  if (!label) return null;
  switch (label.toLowerCase()) {
    case "bus":
      return <Bus {...props} />;
    case "tram":
    case "rail":
    case "subway":
      return <Max {...props} />;
    case "walk":
      return <Walk {...props} />;
    case "bicycle":
    case "bicycle_rent":
      return <Bicycle {...props} />;
    case "ferry":
      return <Ferry {...props} />;
    case "gondola":
      return <AerialTram {...props} />;
    case "car":
      return <Car {...props} />;
    case "micromobility":
    case "micromobility_rent":
      return <Micromobility {...props} />;
    default:
      return null;
  }
}

export default TriMetModeIcon;
