import styled from "styled-components";

import { TransparentButton } from "../styled-legs";

export const AgencyInfo = styled.div`
  margin-top: 5px;

  a {
    color: #337ab7;
    text-decoration: none;
  }

  img {
    vertical-align: middle;
  }
`;

export const IntermediateStops = styled.div`
  display: block;
`;

export const StopMarker = styled.div`
  float: left;
  margin-left: -36px;
  color: #fff;
`;

export const StopName = styled.div`
  color: #999;
  font-size: 14px;
  margin-top: 3px;
`;

export const StopRow = styled.div`
  z-index: 30;
  position: relative;
`;

export const TransitAlert = styled.div`
  margin-top: 5px;
  background-color: #eee;
  padding: 8px;
  color: #000;
  border-radius: 4px;
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
  display: inline-block;
  margin-top: 8px;
  color: #d14727;
  font-weight: 400;
  cursor: pointer;
`;

export const ViewTripButton = styled(TransparentButton)`
  color: #008;
  outline: none;
  height: 14px;
  padding-top: 0;
  line-height: 1;
  margin-left: 5px;
  border-left: 1px solid #000;
`;
