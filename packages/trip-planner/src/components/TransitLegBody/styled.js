import styled from "styled-components";
import { ClearButton } from "~/packages/trip-planner/src/common/components/Styled";
import BaseExpandIcon from "../ExpandIcon";
import { toModeBorderColor } from "../../utils/mode";

export const LegBody = styled.div`
  padding: 15px 0 15px 15px;
`;

// TODO: Consolidate this with the Access Leg Summary?
export const TransitLegSummary = styled(ClearButton).attrs(props => ({
  "aria-pressed": props.expanded
}))`
  width: 100%;
  font-size: 1.1em;
`;

export const RouteLongName = styled.span`
  /* Short name for route */
`;

export const Lighten = styled.span`
  font-weight: 200;
`;

export const AgencyInfo = styled.div``;

export const AgencyLink = styled.a.attrs({
  target: "_blank"
})``;

export const AgencyLogo = styled.img.attrs(props => ({
  alt: `${props.agencyName} Logo`,
  height: 25
}))`
  margin-left: 5px;
`;

export const TransitLegDetails = styled.div``;

export const TransitLegDetailsHeader = styled(ClearButton)``;

export const ExpandIcon = styled(BaseExpandIcon).attrs(props => ({
  width: 10,
  height: 10,
  fill: toModeBorderColor(props.mode)
}))`
  padding-left: 5px;
`;

export const IntermediateStopsListWrapper = styled.div`
  overflow: hidden;
  height: auto;
  max-height: ${props => (props.expanded === "true" ? "1000px" : "0")};
  transition: max-height 1s ease-in-out;
`;

export const IntermediateStopsList = styled.div``;

export const IntermediateStopRow = styled.div`
  display: flex;
  flex-flow: row;
`;

export const StopMarker = styled.div`
  flex: 0 0 10px;
`;

export const StopName = styled.div`
  flex: 1 1 auto;
`;
