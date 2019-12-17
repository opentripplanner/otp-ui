import BaseMapIcon from "@opentripplanner/icons/lib/trimet/Map";
import styled from "styled-components";

import { toModeBorder, toModeColor } from "./util";

export const ClearButton = styled.button`
  background: transparent;
  color: inherit;
  border: 0;
  text-align: inherit;
  text-decoration: none;

  &:focus {
    /* What's our hover color for the     se? */
    background-color: ${props => props.theme.tertiaryColor};
    outline: 0;
  }

  &:hover {
    background-color: ${props => props.theme.hoverColor};
  }

  &:active {
    background-color: ${props => props.theme.activeColor};
  }
`;

export const TestDiv = styled.div`
  height: 300px;
`;

export const PlaceRowWrapper = styled.div`
  /* needs to be a flexbox row */
  max-width: 500px;
  display: flex;
  flex-flow: row;
`;

export const TimeColumn = styled.div`
  /* flexbox column */
  flex: 0 0 60px;
  padding-right: 5px;
  font-size: 0.9em;
`;

export const LineColumn = styled.div`
  /* flexbox column */
  flex: 0 0 50px;
  padding-right: 5px;
`;

/*
  This is needed to give the offset border look to stacked place rows
  Since the value we have access to is "interlineWithPreviousLeg" then we
  have to show/hide the top border of the div and apply a small offset
*/
export const LightBorderDiv = styled.div`
  border-top-style: solid;
  border-top-width: ${props => (props.hideBorder === "true" ? "0" : "2px")};
  border-top-color: ${props => props.theme.borderColor};
  padding-top: ${props => (props.hideBorder === "true" ? "0" : "10px")};
  padding-bottom: ${props => (props.hideBorder === "true" ? "10px" : "0")};
  transform: ${props =>
    props.hideBorder === "true" ? "" : "translateY(-12px)"};
`;

export const DetailsColumn = styled(LightBorderDiv)`
  /* flexbox column -- remaining space */
  flex: 2 2 auto;
  /* overflow: hidden; this is commented out in order to show Intermediate Stop Markers */
`;

export const MapButtonColumn = styled(LightBorderDiv)`
  flex: 0 0 25px;
`;

export const LegLine = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
`;

export const InnerLine = styled.div`
  /* the actual line element */
  border-left: ${props => toModeBorder(props.mode, props.routeColor)};
  height: 100%;
  width: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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

// TODO: Can we turn this into a more abstract element to inherit from for other badges?
export const AccessBadge = styled.div.attrs(props => ({
  "aria-label": `Travel by ${props.mode}`
}))`
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

export const Destination = styled.div`
  text-align: center;
`;

// export const ModeIcon = styled(BaseModeIcon).attrs(props => ({
//   width: 18,
//   height: 18,
//   title: props.title || "",
//   fill: "black"
// }))``;

export const PlaceDetails = styled.div`
  /* container for Leg details */
  /* padding: 15px 0 15px 15px; */
  /* padding-bottom: 15px; */
`;

export const PlaceHeader = styled.div`
  display: flex;
  font-size: 1.2em;
`;

export const InterlineDot = styled.div`
  color: #fff;
  flex: 0 0 15px;
  margin-left: -33px;
  margin-right: 18px;
  position: relative;
  z-index: 30;
`;

export const PlaceName = styled.div`
  /* text styling */
  font-weight: bold;
  height: 1.2em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1 1 auto;
`;

export const InterlineName = styled.div`
  /* special messaging, not sure yet */
`;

export const StopIdSpan = styled.span`
  font-weight: 200;
  font-size: 0.9em;
  margin-left: 10px;
`;

export const MapButton = styled(ClearButton)`
  padding: 3px 10px 3px 10px;
  border: 0;
  margin-top: -15px;
  width: 35px;
  height: 35px;
`;

export const MapIcon = styled(BaseMapIcon).attrs(props => ({
  fill: props.theme.secondaryColor,
  width: 15,
  height: 15,
  role: "img",
  title: "Frame this Itinerary Leg"
}))``;

export const ItineraryBody = styled.div``;
