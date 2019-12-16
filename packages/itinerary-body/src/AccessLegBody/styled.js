import styled from "styled-components";

import * as StyledLegs from "../styled-legs";

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
