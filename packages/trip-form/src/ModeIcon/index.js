import React from "react";
import PropTypes from "prop-types";
import * as Icons from "@opentripplanner/icons";

/**
 * A generic icon component that displays an icon for the specified transportation mode.
 * If `icons` are defined, then
 * the icon will be attempted to be used from that lookup of icons. Otherwise,
 * an icon from the OTP-UI icons package will be returned.
 */
const ModeIcon = ({ icons, mode }) => {
  if (!mode) return null;

  // Check if there is a custom icon
  if (icons && mode in icons) {
    return icons[mode];
  }

  // From OTP-RR:lib/util/itinerary.js:
  // Custom icon not available for the given iconId. Use the ModeIcon component
  // to show the icon based on the iconId, but always use the default car icon
  // for any car-based modes that didn't have custom icon.
  const finalMode = mode && mode.startsWith("CAR") ? "CAR" : mode;

  switch (finalMode.toLowerCase()) {
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
   * A customized lookup of icons.
   * These are defined as part of the implementing webapp.
   * If this lookup is not defined, then a lookup using the OPT-UI icons package will be used instead.
   */
  // eslint-disable-next-line react/forbid-prop-types
  icons: PropTypes.object,
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

ModeIcon.defaultProps = {
  icons: null
};

export default ModeIcon;
