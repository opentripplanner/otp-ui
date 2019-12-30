import React from "react";
import PropTypes from "prop-types";
import * as Icons from "@opentripplanner/icons";

/**
 * A generic icon component that displays an icon for the specified mode.
 */
const ModeIcon = props => {
  const { mode } = props;
  if (!mode) return null;
  switch (mode.toLowerCase()) {
    case "bus":
      return <Icons.Bus />;
    case "tram":
    case "rail":
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
    default:
      return null;
  }
};

ModeIcon.propTypes = {
  /**
   * The mode to depict. Can be one of the supported values,
   * in any combination of upper-case and lower-case letters.
   * Nothing is displayed if the mode is not one of the supported values.
   */
  mode: PropTypes.oneOf([
    "bus",
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
    "micromobility_rent"
  ]).isRequired
};

export default ModeIcon;
