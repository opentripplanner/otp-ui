import coreUtils from "@opentripplanner/core-utils";
import { Place } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedTime } from "react-intl";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import { ExclamationTriangle } from "@styled-icons/fa-solid/ExclamationTriangle";

import ItineraryBody from "..";
import OtpRRTransitLegSubheader from "../otp-react-redux/transit-leg-subheader";
import * as ItineraryBodyClasses from "../styled";
import {
  TimeColumnContentProps,
  TransitLegSubheaderProps,
  TransitLegSummaryProps
} from "../types";

export function CustomPlaceName({ place }: { place: Place }): string {
  return `🎉✨🎊 ${place.name} 🎉✨🎊`;
}

/**
 * Custom component, for illustration purposes only, for displaying the time and other info
 * of the given leg in the time column of the ItineraryBody -> PlaceRow component.
 */
export function CustomTimeColumnContent({
  isDestination,
  leg
}: TimeColumnContentProps): ReactElement {
  const time = isDestination ? leg.endTime : leg.startTime;

  return (
    <>
      <div>
        <span style={{ color: "#E60000" }}>
          <FormattedTime value={time} />
        </span>
      </div>
      <div style={{ fontSize: "80%", lineHeight: "1em" }}>
        <ExclamationTriangle style={{ height: "1em" }} /> Delayed xx&nbsp;min.
      </div>
    </>
  );
}

export function customToRouteAbbreviation(route: number | string): string {
  if (route.toString().length < 3) {
    return route.toString();
  }
  return undefined;
}

export function CustomTransitLegSummary({
  leg,
  onClick,
  stopsExpanded
}: TransitLegSummaryProps): ReactElement {
  return (
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    <div onClick={onClick}>
      {leg.duration && (
        <span>Ride {coreUtils.time.formatDuration(leg.duration, "en-US")}</span>
      )}
      {leg.intermediateStops && (
        <span>
          {` (${leg.intermediateStops.length + 1} stops)`}
          <ItineraryBodyClasses.CaretToggle expanded={stopsExpanded} />
        </span>
      )}
    </div>
  );
}

export const StyledItineraryBody = styled(ItineraryBody)`
  ${ItineraryBodyClasses.LegBody} {
    background-color: pink;
  }

  ${ItineraryBodyClasses.TimeColumn} {
    color: #676767;
    font-size: 14px;
    padding-right: 4px;
    padding-top: 1px;
    text-align: right;
    vertical-align: top;
    width: 60px;
  }
`;

export function WrappedOtpRRTransitLegSubheader({
  leg
}: TransitLegSubheaderProps): ReactElement {
  return (
    <OtpRRTransitLegSubheader
      leg={leg}
      onStopClick={action("Transit Stop Click")}
    />
  );
}
