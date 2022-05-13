// Removed as core-utils is typescripted. TODO: Remove when typescripting!
/* eslint-disable react/forbid-prop-types */
import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Tooltip } from "react-leaflet";
import L from "leaflet";

import { TooltipStyle } from "../styled";
import { defaultMessages, linterIgnoreTheseProps } from "../../../utils";

const { formatDurationWithSeconds } = coreUtils.time;

/** will show a (leaflet) map tooltip on a vehicle, showing route and update recency */
export default function VehicleTooltip(props) {
  const { vehicle, isTracked, direction, permanent, offset } = props;
  linterIgnoreTheseProps(isTracked);

  const { routeShortName, routeType, seconds } = vehicle;

  let name = routeShortName;
  // This condition avoids processing long route names such as "Portland Streetcar".
  if (routeShortName?.length <= 5) {
    name = routeType ? (
      // This produces text such as "MAX Green", so don't localize.
      `${routeType} ${routeShortName}`
    ) : (
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitVehicleOverlay.genericRouteFormat"]
        }
        description="Formats a route label"
        id="otpUi.TransitVehicleOverlay.genericRouteFormat"
        values={{
          route: routeShortName
        }}
      />
    );
  }

  return (
    <Tooltip permanent={permanent} direction={direction} offset={offset}>
      <TooltipStyle>
        <TooltipStyle.Title>
          <FormattedMessage
            defaultMessage={
              defaultMessages["otpUi.TransitVehicleOverlay.tooltipRouteLabel"]
            }
            description="Displays a route label in a tooltip"
            id="otpUi.TransitVehicleOverlay.tooltipRouteLabel"
            values={{
              routeLabel: name
            }}
          />
        </TooltipStyle.Title>
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TransitVehicleOverlay.durationAgo"]
          }
          description="Text describing a past duration"
          id="otpUi.TransitVehicleOverlay.durationAgo"
          values={{
            // FIXME: also localize formatDurationWithSeconds
            duration: formatDurationWithSeconds(seconds)
          }}
        />
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
