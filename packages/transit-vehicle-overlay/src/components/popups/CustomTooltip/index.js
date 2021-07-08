import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "react-leaflet";
import L from "leaflet";

import { TooltipStyle } from "../styled";
import { linterIgnoreTheseProps } from "../../../utils";

/** will show a (leaflet) map tooltip on a vehicle, with custom information (e.g. arrival data) */
export default function CustomTooltip(props) {
  const {
    vehicle,
    isTracked,
    allMarkers,
    getContent,
    offset,
    permanent,
    direction
  } = props;

  // note: only build tooltip content if we're about to render it on a tooltip
  let tooltipContent = null;
  if (isTracked || allMarkers) tooltipContent = getContent(vehicle, isTracked);

  // the custom "rotation" tooltip orientation is either top or bottom
  let dir = direction;
  if (direction === "rotation") {
    dir = "top";
    if (vehicle && (vehicle.heading < 80 || vehicle.heading > 280))
      dir = "bottom";
  }

  return (
    tooltipContent &&
    (isTracked || allMarkers) && (
      <Tooltip permanent={permanent} direction={dir} offset={offset}>
        <TooltipStyle>{tooltipContent}</TooltipStyle>
      </Tooltip>
    )
  );
}

CustomTooltip.propTypes = {
  /** vehicle record - @see: core-utils/types/transitVehicleType */
  vehicle: coreUtils.types.transitVehicleType,

  /** callback used to supply content of the tip (e.g, "arrives in 5 minutes") */
  getContent: PropTypes.func,

  /** indicate if this vehicle is being tracked, */
  isTracked: PropTypes.bool,

  /** control whether the tip goes on all markers or just the tracked marker */
  allMarkers: PropTypes.bool,

  /** is the tip always shown, or just shown on mouse hover */
  permanent: PropTypes.bool,

  /** placement: rotation (top/bot based on marker orientation), auto, left, right, top, bottom */
  direction: PropTypes.string,

  /** center of the marker, or some X,Y position in relation to the marker's center */
  offset: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

CustomTooltip.defaultProps = {
  vehicle: null,
  isTracked: false,
  allMarkers: false,
  getContent: (vehicle, isTracked) => {
    linterIgnoreTheseProps(vehicle, isTracked);
    return null;
  },
  permanent: true,
  direction: "rotation",
  offset: new L.Point(0, 0)
};
