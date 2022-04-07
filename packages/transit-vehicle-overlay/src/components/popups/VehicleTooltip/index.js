// Removed as core-utils is typescripted. TODO: Remove when typescripting!
/* eslint-disable react/forbid-prop-types */
import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "react-leaflet";
import L from "leaflet";

import { TooltipStyle } from "../styled";
import { linterIgnoreTheseProps } from "../../../utils";

const { formatDurationWithSeconds } = coreUtils.time;

/** will show a (leaflet) map tooltip on a vehicle, showing route and update recency */
export default function VehicleTooltip(props) {
  const { vehicle, isTracked, direction, permanent, offset } = props;
  linterIgnoreTheseProps(isTracked);

  let name = vehicle.routeShortName;
  if (name !== null && name.length <= 5) {
    const mode = vehicle.routeType ? vehicle.routeType : "Line";
    name = `${mode} ${name}`;
  }

  return (
    <Tooltip permanent={permanent} direction={direction} offset={offset}>
      <TooltipStyle>
        <TooltipStyle.Title>{name}: </TooltipStyle.Title>
        {formatDurationWithSeconds(vehicle.seconds)} ago
      </TooltipStyle>
    </Tooltip>
  );
}

VehicleTooltip.propTypes = {
  /** vehicle record - @see: core-utils/types/transitVehicleType */
  // vehicle: coreUtils.types.transitVehicleType,
  vehicle: PropTypes.object,

  /** indicate if this vehicle is being tracked, */
  isTracked: PropTypes.bool,

  /** is the tip always shown, or just shown on mouse hover */
  permanent: PropTypes.bool,

  /** tip placement (side(s), top, bottom) */
  direction: PropTypes.string,

  /** center of the marker, or some X,Y position in relation to the marker's center */
  offset: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

VehicleTooltip.defaultProps = {
  vehicle: null,
  isTracked: false,
  permanent: false,
  direction: "auto",
  offset: new L.Point(0, 0)
};
