import styled from "styled-components";

import * as StyledLegs from "../styled-legs";

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

export const BookTNCRideButton = styled.a`
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  color: #333;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  left: 0;
  line-height: 1.42857143;
  margin-bottom: 0;
  padding-bottom: 12px;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 4px;
  position: absolute;
  text-align: center;
  text-decoration: none;
  top: 0;
  touch-action: manipulation;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
`;

export const BookTNCRideButtonContainer = styled.div`
  height: 32px;
  margin-bottom: 10px;
  margin-top: 10px;
  position: relative;
`;

export const LegIconContainer = styled.div`
  height: 24px;
  width: 24px;
  float: left;
  margin-right: 6px;
`;

export const PreviewContainer = styled.div`
  background-color: ${props => props.active && "#eee"};
  border-color: ${props => (props.active ? "#d1d5da" : "#fff")};
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  display: inline-block;
  font-style: normal;
  margin: 0 4px;
  position: relative;
  text-align: center;
  text-decoration: none;
  width: 75%;

  &:hover {
    border-color: #d1d5da;
    background-color: #f6f8fa;
  }
`;

export const PreviewDiagram = styled(StyledLegs.TransparentButton)`
  padding: 2px;
  width: 100%;
`;

export const Steps = styled.div`
  display: block;
`;

export const StepDescriptionContainer = styled.div`
  margin-left: 24px;
  line-height: 1.25em;
  padding-top: 1px;
`;

export const StepsHeader = styled(StyledLegs.TransparentButton)`
  color: #999;
  display: inline-block;
  font-size: 13px;
  font-style: normal;
  margin-top: 10px;
  vertical-align: bottom;
`;

export const StepIconContainer = styled.div`
  fill: #999999;
  float: left;
  height: 16px;
  width: 16px;
`;

export const StepRow = styled.div`
  font-size: 13px;
  margin-top: 8px;
  color: #999;
  font-style: normal;
`;

export const StepStreetName = styled.span`
  font-weight: 500;
`;
