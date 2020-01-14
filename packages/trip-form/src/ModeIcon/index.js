import React from "react";
import PropTypes from "prop-types";
import * as Icons from "@opentripplanner/icons";

/**
 * A generic icon component that displays an icon for the specified transportation mode.
 */
const ModeIcon = props => {
  const { mode } = props;
  if (!mode) return null;
  switch (mode.toLowerCase()) {
    case "bus":
      return <Icons.Bus />;
    case "tram":
      return <Icons.Max />;
    case "rail":
      return <Icons.Wes />;
    case "subway":
      return <Icons.Streetcar />;
    case "walk":
      return <Icons.Walk />;
    case "bicycle":
      return <Icons.Bike />;
    case "bicycle_rent":
      return <Icons.Biketown />;
    case "ferry":
      return <Icons.Ferry />;
    case "gondola":
      return <Icons.AerialTram />;
    case "car_park":
      return <Icons.Car />;
    case "car_hail":
      return <Icons.Uber />;
    case "micromobility":
    case "micromobility_rent":
      return <Icons.Micromobility />;
    case "transit":
      return <Icons.TriMet />;
    default:
      return null;
  }
};

ModeIcon.propTypes = {
  /**
   * One of the supported modes (case-insensitive):
   * "bus",
    "tram",
    "rail",
    "subway",
    "walk",
    "bicycle",
    "bicycle_rent",
    "ferry",
    "gondola",
    "car_park",
    "car_hail",
    "micromobility",
    "micromobility_rent",
    "transit"
   */
  mode: PropTypes.string.isRequired
};

export default ModeIcon;
