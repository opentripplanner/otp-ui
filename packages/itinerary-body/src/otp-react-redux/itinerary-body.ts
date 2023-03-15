import styled from "styled-components";

import ItineraryBody from "../ItineraryBody";
import * as ItineraryBodyClasses from "../styled";

const StyledItineraryBody = styled(ItineraryBody)`
  font-size: 16px;

  *:not(.fa) {
    box-sizing: border-box;
    font-family: Hind, sans-serif;
  }

  ${ItineraryBodyClasses.InterlineDot} {
    margin-left: -18px;
    margin-right: 3px;
  }

  ${ItineraryBodyClasses.LegDescriptionRouteShortName} {
    background-color: rgb(15, 106, 172);
    border-color: white;
    border-image: initial;
    border-radius: 12px;
    border-style: solid;
    border-width: 1px;
    box-shadow: rgb(0, 0, 0) 0px 0px 0.25em;
    color: white;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    line-height: 1.5;
    margin-right: 8px;
    min-width: 24px;
    padding: 2px 3px;
    text-align: center;
  }

  ${ItineraryBodyClasses.LineColumn} {
    display: table-cell;
    max-width: 20px;
    width: 20px;
    padding: 0;
    position: relative;
  }

  ${ItineraryBodyClasses.PlaceHeader} {
    color: #000;
    font-size: 18px;
    font-weight: 500;
    line-height: 20px;
  }

  ${ItineraryBodyClasses.PlaceName} {
    height: inherit;
    white-space: normal;
  }

  ${ItineraryBodyClasses.PlaceRowWrapper} {
    width: 100%;
  }

  ${ItineraryBodyClasses.StopMarker} {
    margin-left: -17px;
  }

  ${ItineraryBodyClasses.TimeColumn} {
    color: #676767;
    display: table-cell;
    font-size: 14px;
    padding-right: 4px;
    padding-top: 1px;
    text-align: right;
    vertical-align: top;
    width: 60px;
  }
`;

export default StyledItineraryBody;
