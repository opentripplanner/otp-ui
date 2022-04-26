import React from "react";

import { Bicycle, Car, Micromobility, Walk } from "./trimet-2021";

/**
 * These icons are not an entire set and are only used in the 2021
 * custom TriMet mode selector component
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
    case "scooter":
      return <Micromobility {...props} />;
    case "walk":
      return <Walk {...props} />;
    default:
      return null;
  }
}

export default TriMetModeIcon;
