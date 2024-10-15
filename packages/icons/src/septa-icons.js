import React from "react";

import { Bike, Bus, Car, Rail, Walk, Metro } from "./septa";

/**
 * These icons are not an entire set, but contain everything needed in southeastern Pennsylvania
 */
function SeptaModeIcon({ mode, ...props }) {
  if (!mode) return null;
  switch (mode.toLowerCase()) {
    case "bicycle":
    case "bicycle_rent":
      return <Bike {...props} />;
    case "bus":
    case "trolleybus":
      return <Bus {...props} />;
    case "car":
    case "car_park":
    case "car_hail":
      return <Car {...props} />;
    case "streetcar":
    case "tram":
    case "transit":
    case "subway":
    case "metro":
      return <Metro {...props} />;
    case "walk":
      return <Walk {...props} />;
    case "rail":
      return <Rail {...props} />;
    default:
      return null;
  }
}

export default SeptaModeIcon;
