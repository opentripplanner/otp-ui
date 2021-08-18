import React from "react";

import { Bicycle, Car, Micromobility, Walk } from "./trimet-2021";

/**
 * Icons for 2021 TriMet mode selector.
 */

function TriMetModeIcon({ mode, ...props }) {
  if (!mode) return null;
  switch (mode.toLowerCase()) {
    case "bicycle":
    case "bicycle_rent":
      return <Bicycle {...props} />;
    case "car":
    case "car_park":
    case "car_hail":
      return <Car {...props} />;
    case "micromobility":
    case "micromobility_rent":
      return <Micromobility {...props} />;
    case "walk":
      return <Walk {...props} />;
    default:
      return null;
  }
}

export default TriMetModeIcon;
