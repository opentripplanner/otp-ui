import {
  formatDuration,
  formatTime
} from "@opentripplanner/core-utils/lib/time";
import {
  languageConfigType,
  legType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import { ExclamationTriangle } from "styled-icons/fa-solid";

import ItineraryBody from "..";
import OtpRRTransitLegSubheader from "../otp-react-redux/transit-leg-subheader";
import * as ItineraryBodyClasses from "../styled";

export function CustomPlaceName({ place }) {
  return `🎉✨🎊 ${place.name} 🎉✨🎊`;
}

/**
 * Custom component, for illustration purposes only, for displaying the time and other info
 * of the given leg in the time column of the ItineraryBody -> PlaceRow component.
 */
export function CustomTimeColumnContent({ isDestination, leg, timeOptions }) {
  const time = isDestination ? leg.endTime : leg.startTime;

  return (
    <>
      <div>
        <span style={{ color: "red" }}>
          {time && formatTime(time, timeOptions)}
        </span>
      </div>
      <div style={{ fontSize: "80%", lineHeight: "1em" }}>
        <ExclamationTriangle style={{ height: "1em" }} /> Delayed xx&nbsp;min.
      </div>
    </>
  );
}

CustomTimeColumnContent.propTypes = {
  isDestination: PropTypes.bool.isRequired,
  leg: legType.isRequired,
  timeOptions: timeOptionsType
};

CustomTimeColumnContent.defaultProps = {
  timeOptions: null
};

export function customToRouteAbbreviation(route) {
  if (route.toString().length < 3) {
    return route;
  }
  return undefined;
}

export function CustomTransitLegSummary({ leg, onClick, stopsExpanded }) {
  return (
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    <div onClick={onClick}>
      {leg.duration && <span>Ride {formatDuration(leg.duration)}</span>}
      {leg.intermediateStops && (
        <span>
          {` (${leg.intermediateStops.length + 1} stops)`}
          <ItineraryBodyClasses.CaretToggle expanded={stopsExpanded} />
        </span>
      )}
    </div>
  );
}

CustomTransitLegSummary.propTypes = {
  leg: legType.isRequired,
  onClick: PropTypes.func.isRequired,
  stopsExpanded: PropTypes.bool.isRequired
};

export const StyledItineraryBody = styled(ItineraryBody)`
  ${ItineraryBodyClasses.LegBody} {
    background-color: pink;
  }

  ${ItineraryBodyClasses.TimeColumn} {
    color: #999;
    font-size: 14px;
    padding-right: 4px;
    padding-top: 1px;
    text-align: right;
    vertical-align: top;
    width: 60px;
  }
`;

export function WrappedOtpRRTransitLegSubheader({ languageConfig, leg }) {
  return (
    <OtpRRTransitLegSubheader
      languageConfig={languageConfig}
      leg={leg}
      onStopClick={action("Transit Stop Click")}
    />
  );
}

WrappedOtpRRTransitLegSubheader.propTypes = {
  languageConfig: languageConfigType.isRequired,
  leg: legType.isRequired
};
