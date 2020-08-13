import React from "react";

import { ClassicCar, ClassicFerry, ClassicMicromobility } from "./classic";
import {
  StandardBike,
  StandardBus,
  StandardGondola,
  StandardRail,
  StandardTram,
  StandardWalk
} from "./standard";

/**
 * Icons for all standard MOD-UI modes.
 * Any hail and rental modes managed by one or multiple companies
 * are optional (by default, the company logo will be displayed)
 * but can be overriden here using the pattern
 * <otp_mode>_<company_id> (e.g. 'car_hail_uber').
 * Furthermore, any hail or rental modes managed by a single company
 * are optional (by default, the company logo will be displayed)
 * but can be overriden here using the pattern
 * <otp_mode> (e.g. 'bicycle_rent').
 */
function StandardModeIcon({ mode, ...props }) {
  if (!mode) return null;
  switch (mode.toLowerCase()) {
    case "bicycle":
    case "bicycle_rent":
      return <StandardBike {...props} />;
    case "bus":
      return <StandardBus {...props} />;
    case "car":
    case "car_park":
      return <ClassicCar {...props} />;
    case "ferry":
      return <ClassicFerry {...props} />;
    case "gondola":
      return <StandardGondola {...props} />;
    case "micromobility":
    case "micromobility_rent":
      return <ClassicMicromobility {...props} />;
    case "rail":
      return <StandardRail {...props} />;
    case "subway":
    case "tram":
      return <StandardTram {...props} />;
    case "transit":
      return <StandardBus {...props} />;
    case "walk":
      return <StandardWalk {...props} />;
    default:
      return null;
  }
}

export default StandardModeIcon;
