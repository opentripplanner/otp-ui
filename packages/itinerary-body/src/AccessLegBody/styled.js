import styled from "styled-components";

export const TransparentButton = styled.button`
  background: transparent;
  color: inherit;
  border: 0;
  text-decoration: none;
`;

export const AccessLegClickable = styled(TransparentButton)`
  cursor: pointer;
  display: table;
`;

export const LegBody = styled.div`
  color: #999;
  font-size: 13px;
  padding: 12px 0 18px 4px;
`;

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

export const StepsHeader = styled(TransparentButton)`
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
