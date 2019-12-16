import styled from "styled-components";

import * as StyledLegs from "../styled-legs";

export const LegIconContainer = styled.div`
  height: 24px;
  width: 24px;
  float: left;
  margin-right: 6px;
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
  font-size: 13px;
  margin-top: 10px;
  color: #999;
  font-style: normal;
  display: inline-block;
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
