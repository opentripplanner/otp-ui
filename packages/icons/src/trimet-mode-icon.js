import React from "react";

import {
  AerialTram,
  Bicycle,
  Bus,
  Car,
  Ferry,
  Max,
  Micromobility,
  Streetcar,
  TriMet,
  Walk,
  Wes
} from "./trimet";

/**
 * Icons for all TriMet modes.
 * Any hail and rental modes managed by one or multiple companies
 * are optional but can be overriden here using the
 * pattern <otp_mode>_<company_id> (e.g. 'car_hail_uber').
 */
function TriMetModeIcon({ mode, ...props }) {
  if (!mode) return null;
  switch (mode.toLowerCase()) {
    case "bicycle":
      // case "bicycle_rent":
      return <Bicycle {...props} />;
    case "bus":
      return <Bus {...props} />;
    case "car":
    case "car_park":
      return <Car {...props} />;
    case "ferry":
      return <Ferry {...props} />;
    case "gondola":
      return <AerialTram {...props} />;
    case "micromobility":
    case "micromobility_rent":
      return <Micromobility {...props} />;
    case "rail":
      return <Wes {...props} />;
    case "streetcar":
      return <Streetcar {...props} />;
    case "subway":
    case "tram":
      return <Max {...props} />;
    case "transit":
      return <TriMet {...props} />;
    case "walk":
      return <Walk {...props} />;
    default:
      return null;
  }
}

export default TriMetModeIcon;
