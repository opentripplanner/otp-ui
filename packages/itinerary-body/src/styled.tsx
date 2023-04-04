// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { Map } from "@opentripplanner/icons";
import React, { ReactElement } from "react";
import styled from "styled-components";
import { CaretDown } from "@styled-icons/fa-solid/CaretDown";
import { CaretUp } from "@styled-icons/fa-solid/CaretUp";
import { ExclamationTriangle } from "@styled-icons/fa-solid/ExclamationTriangle";

import { toModeBorder, toModeColor, toSafeRouteColor } from "./util";

interface LightBorderDivProps {
  hideBorder: string;
  theme?: {
    borderColor?: string;
  };
}

/**
 * This component is needed to give the offset border look to stacked place rows
 * Since the value we have access to is "interlineWithPreviousLeg" then we
 * have to show/hide the top border of the div and apply a small offset
 */
export const LightBorderDiv = styled.div<LightBorderDivProps>`
  border-top-style: solid;
  border-top-width: ${props => (props.hideBorder === "true" ? "0" : "2px")};
  border-top-color: ${props => props.theme.borderColor};
  padding-top: ${props => (props.hideBorder === "true" ? "0" : "10px")};
  padding-bottom: ${props => (props.hideBorder === "true" ? "10px" : "0")};
  transform: ${props =>
    props.hideBorder === "true" ? "" : "translateY(-12px)"};
`;

export const TransparentButton = styled.button`
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  font-size: inherit;
  text-decoration: none;
`;

export const AnchorButton = styled.a`
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  color: #333;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  padding: 4px 6px;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  user-select: none;
  white-space: nowrap;

  &:hover {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }

  &:active {
    color: #333;
    background-color: #e6e6e6;
    background-image: none;
    border-color: #adadad;
    outline: 0;
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }

  &:focus {
    color: #333;
    background-color: #e6e6e6;
    border-color: #8c8c8c;
  }

  &:active:hover {
    color: #333;
    background-color: #d4d4d4;
    border-color: #8c8c8c;
  }
`;

export const LinkButton = styled(TransparentButton)`
  color: #008;
  cursor: pointer;
  margin-left: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ViewerButton = styled(LinkButton)`
  padding-left: 0px;

  &:before {
    content: "|";
    color: black;
    margin-right: 5px;
  }
`;

// ////////////////////////////////////////////////
// /////////////// App components /////////////////
// ////////////////////////////////////////////////

interface ModeRouteProps {
  mode: string;
  routeColor: string;
}

// TODO: Can we turn this into a more abstract element to inherit from for other badges?
export const AccessBadge = styled.div<ModeRouteProps>`
  color: black;
  background-color: ${props => toModeColor(props.mode, props.routeColor)};
  border: 2px solid #bbb;
  text-align: center;
  width: 25px;
  height: 25px;
  font-size: 1.2em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1px;
  /* Add in border for dark mode */
`;

export const CallAheadWarning = styled.div`
  color: #b22727;
  margin-top: 5px;
`;

export const BookLaterContainer = styled.div`
  bottom: 0;
  left: 110px;
  position: absolute;
  right: 0;
  top: 0;
`;

export const BookLaterInnerContainer = styled.div`
  background-color: #fcf9d3;
  display: table;
  height: 100%;
  width: 100%;
`;

export const BookLaterPointer = styled.div`
  border-bottom: 16px solid transparent;
  border-right: 16px solid #fcf9d3;
  border-top: 16px solid transparent;
  height: 0;
  left: 94px;
  position: absolute;
  top: 0;
  width: 0;
`;

export const BookLaterText = styled.div`
  color: #444;
  display: table-cell;
  font-style: italic;
  line-height: 0.95;
  padding: 0px 2px;
  vertical-align: middle;
`;

export const BookTNCRideButton = styled(AnchorButton)``;

export const BookTNCRideButtonContainer = styled.div`
  height: 32px;
  margin-bottom: 10px;
  margin-top: 10px;
  position: relative;
`;

export const TNCTravelTime = styled.div`
  /* no styling */
`;

export const TNCCost = styled.div`
  /* no styling */
`;

interface CaretToggleProps {
  className?: string;
  expanded: boolean;
}

export const CaretToggleBase = ({
  className,
  expanded
}: CaretToggleProps): ReactElement => (
  <span className={className}>
    {expanded ? <CaretUp size={15} /> : <CaretDown size={15} />}
  </span>
);

export const CaretToggle = styled(CaretToggleBase)`
  &::before {
    content: "";
    margin: 0 0.125em;
  }
`;

export const Destination = styled.div`
  text-align: center;
`;

export const InnerLine = styled.div<ModeRouteProps>`
  /* the actual line element */
  border-left: ${props => toModeBorder(props.mode, props.routeColor)};
  height: 100%;
  width: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const InterlineDot = styled.div`
  color: #fff;
  flex: 0 0 15px;
  margin-left: -33px;
  margin-right: 18px;
  position: relative;
  z-index: 30;
`;

export const InterlineName = styled.div`
  /* special messaging, not sure yet */
`;

export const IntermediateStops = styled.ol`
  display: block;
  font-size: 13px;
  list-style: none;
  padding: 0;
`;

export const ItineraryBody = styled.ol`
  list-style: none;
  padding: 0;
`;

export const LegBody = styled.div`
  color: #676767;
  font-size: 13px;
  padding-bottom: 12px;
`;

export const LegClickable = styled.div``;

/**
 * Transparent button, clickable by all, with an invisible text about zooming to a leg on the map.
 * The button sits on top of LegDescription, so that the button's text visually appears to be
 * that of LegDescription.
 */
export const LegClickableButton = styled(TransparentButton)`
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  /* This is required for the entire leg to be clickable in Firefox. */
  width: 100%;
  /* Place the button just above the elevation chart, 
     so that its outline doesn't appear clipped in Chromium. */
  z-index: 1;
`;

// Use <span> for correct semantics as it is the contents of a button or a link.
export const LegDescription = styled.span`
  align-items: center;
  display: inline-flex;
  line-height: 16px;
  min-height: 31px;
  position: relative;
`;

// additional description added to ClickableLeg for screenreaders
export const InvisibleAdditionalDetails = styled.span`
  display: block;
  grid-row-start: 2;
  grid-column-start: 1;
  height: 0;
  overflow: hidden;
  width: 0;
`;

export const LegDescriptionHeadsignPrefix = styled.span`
  font-weight: 200;
`;

/**
 * Lets others apply styles to the mode text in
 * "Bicycle 0.5 miles to City Hall"
 */
export const LegDescriptionMode = styled.span`
  font-weight: inherit;
`;

/**
 * Lets others apply styles to the place text in
 * "Bicycle 0.5 miles to City Hall"
 */
export const LegDescriptionPlace = styled.span`
  font-weight: inherit;
`;

export const LegDescriptionRouteLongName = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

export const LegDescriptionRouteShortName = styled.span`
  font-weight: 800;
  margin-right: 6px;
`;

export const LegDescriptionForTransit = styled(LegDescription)`
  color: #807373;
  margin-top: 5px;
`;

export const LegIconContainer = styled.span`
  img,
  svg {
    margin-right: 6px;
    height: 24px;
    width: 24px;
    vertical-align: bottom;
  }
`;

export const LegIconAndRouteShortName = styled.span`
  flex-shrink: 0;
`;

export const LegLine = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
`;

export const LineBadgeContainer = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-51%, -10%);
`;

export const LineColumn = styled.div`
  /* flexbox column */
  grid-column-start: 2;
  grid-row: span 2;
  padding-right: 5px;
`;

export const LegDetails = styled.span`
  display: grid;
  grid-template-columns: 100px auto;
`;

export const PlaceRowWrapper = styled.li`
  /* needs to be a flexbox row */
  max-width: 500px;
  display: grid;
  grid-template-columns: 65px 30px auto;
`;

interface PreviewContainerProps {
  active: boolean;
}

export const PreviewContainer = styled.div<PreviewContainerProps>`
  background-color: ${props => props.active && "#eee"};
  border-color: ${props => (props.active ? "#d1d5da" : "#fff")};
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  display: inline-block;
  font-style: normal;
  grid-column: 2;
  grid-row: 1;
  margin: 0 4px;
  position: relative;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  width: 75%;

  &:hover {
    border-color: #d1d5da;
    background-color: #f6f8fa;
  }
`;

export const TimeColumn = styled.div`
  grid-column-start: 1;
  grid-row: 1 / span 2;
  padding-right: 5px;
  font-size: 0.9em;
`;

export const MapButton = styled(LinkButton)`
  padding: 3px 10px 3px 10px;
  border: 0;
  margin-top: -15px;
  width: 35px;
  height: 35px;
  &:hover {
    cursor: pointer;
  }
`;

export const MapButtonColumn = styled(LightBorderDiv)`
  flex: 0 0 25px;
  grid-column: -1;
`;

export const MapIcon = styled(Map).attrs(props => ({
  fill: props.theme.secondaryColor,
  width: 15,
  height: 15,
  role: "img"
}))``;

export const PlaceDetails = styled.div`
  grid-row-start: 2;
  grid-column-start: 3;
`;

export const PlaceHeader = styled.div`
  display: flex;
  font-size: 1.2em;
  grid-row-start: 1;
  grid-column-start: 3;
`;

export const PlaceName = styled.span`
  /* text styling */
  font-size: inherit;
  font-weight: bold;
  height: 1.2em;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1 1 auto;
  padding: 3px 0 10px 0;
`;

export const PlaceSubheader = styled.div`
  color: #807373;
  font-size: 13px;
  font-weight: 300;
  padding-left: 4px;
  padding-top: 1px;

  /* Reduce vertical space and fix horizontal alignment of stop id and stop viewer link for transit stops. */
  margin-top: -14px;
  margin-left: -4px;
`;

export const PreviewDiagram = styled(TransparentButton)`
  padding: 2px;
  width: 100%;
`;

export const PreviewDiagramElevationChange = styled.span`
  font-size: xx-small;
  &::before {
    content: "";
    margin: 0 0.125em;
  }
`;

export const PreviewDiagramElevationGain = styled(
  PreviewDiagramElevationChange
)`
  color: #e60000;
`;

export const PreviewDiagramElevationLoss = styled(
  PreviewDiagramElevationChange
)`
  color: green;
`;

export const PreviewDiagramTitle = styled.div`
  font-size: small;
`;

interface RouteBadgeProps {
  routeColor: string;
  theme?: {
    badgeBorderColor?: string;
    mainColor?: string;
  };
}

export const RouteBadge = styled.div<RouteBadgeProps>`
  text-align: center;
  min-width: 30px;
  min-height: 30px;
  font-size: 1.2em;
  background-color: ${props =>
    toSafeRouteColor(props.routeColor) || props.theme.mainColor};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1px;
  /* Add in border for dark mode */
  border: 1px solid ${props => props.theme.badgeBorderColor};
  user-select: none;
  cursor: default;
`;

export const SROnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

export const SRHidden = styled.span.attrs({ "aria-hidden": true })``;

export const Steps = styled.ol`
  display: block;
  list-style: none;
  padding: 0;
`;

export const StepDescriptionContainer = styled.div`
  margin-left: 24px;
  line-height: 1.25em;
  padding-top: 1px;

  & > span {
    margin-right: 1ch;
  }
`;

export const StepsHeaderAndMapLink = styled.span`
  display: inline-flex;
  align-self: center;
  margin-top: 10px;

  /* This is needed to avoid vertical jumps on Safari and Firefox */
  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const StepsHeader = styled(TransparentButton)`
  color: #676767;
  font-size: 13px;
  font-style: normal;
  width: 100%;
`;

export const StepIconContainer = styled.div`
  fill: #676767;
  float: left;
  height: 16px;
  width: 16px;
`;

export const StepRow = styled.li`
  font-size: 13px;
  margin-top: 8px;
  color: #676767;
  font-style: normal;
`;

export const StepStreetName = styled.span`
  font-weight: 500;
`;

export const StopIdSpan = styled.span`
  font-weight: 200;
  font-size: 0.9em;
  margin-left: 10px;
`;

export const StopMarker = styled.div`
  float: left;
  margin-left: -36px;
  color: #fff;
`;

export const StopName = styled.div`
  color: #676767;
  margin-top: 3px;
`;

export const StopRow = styled.li`
  z-index: 30;
  position: relative;
`;

export const TransitAlert = styled.a`
  background-color: #eee;
  border-radius: 4px;
  color: #000;
  display: block;
  margin-top: 5px;
  padding: 8px;
  text-decoration: none;
`;

export const TransitAlertBody = styled.div`
  font-size: 12px;
  margin-left: 30px;
  white-space: pre-wrap;
`;

export const TransitAlertEffectiveDate = styled.div`
  margin-top: 5px;
  margin-left: 30px;
  font-size: 12px;
  font-style: italic;
`;

export const TransitAlertHeader = styled.div`
  font-size: 14px;
  margin-left: 30px;
  font-weight: 600;
`;

export const TransitAlertIconContainer = styled.div`
  float: left;
  font-size: 18px;
`;

export const TransitAlerts = styled.div`
  display: block;
  margin-top: 3px;
`;

export const TransitAlertToggle = styled(TransparentButton)`
  color: #d14727;
  cursor: pointer;
  display: inline-block;
  font-weight: 400;
  margin-top: 8px;
  padding: 0;
`;

export const TransitLegDetails = styled.div`
  margin-top: 5px;
`;

export const TransitLegDetailsHeader = styled.div`
  color: #676767;
  display: flex;
`;

export const TransitLegExpandedBody = styled.div`
  font-size: 14px;
`;

export const TransitLegFare = styled.div`
  /* no styling */
`;

export const TransitLegSummary = styled(TransparentButton)`
  padding: 0;
`;

export const DefaultAlertToggleIcon = styled(ExclamationTriangle).attrs({
  size: 15
})``;

export const DefaultAlertBodyIcon = styled(ExclamationTriangle).attrs({
  size: 18
})``;

export const AgencyInfo = styled.div`
  margin-top: 5px;

  a {
    color: #337ab7;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  img {
    margin-left: 5px;
    vertical-align: middle;
  }
`;
