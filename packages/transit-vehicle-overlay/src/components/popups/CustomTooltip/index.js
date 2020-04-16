import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "react-leaflet";
import L from "leaflet";

import { transitVehicleType } from "@opentripplanner/core-utils/src/types";
import { TooltipStyle } from "../styled";
import { linterIgnoreTheseProps } from "../../../utils";

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

  return (
    tooltipContent &&
    (isTracked || allMarkers) && (
      <Tooltip permanent={permanent} direction={direction} offset={offset}>
        <TooltipStyle>{tooltipContent}</TooltipStyle>
      </Tooltip>
    )
  );
}

CustomTooltip.propTypes = {
  vehicle: transitVehicleType,
  isTracked: PropTypes.bool,
  allMarkers: PropTypes.bool,
  getContent: PropTypes.func,
  permanent: PropTypes.bool,
  direction: PropTypes.string,
  offset: PropTypes.object
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
  direction: "auto",
  offset: new L.Point(0, 0)
};
