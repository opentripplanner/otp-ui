import styled from "styled-components";
import { ClearButton } from "../../common/components/Styled";
import BaseExpandIcon from "../ExpandIcon";
import BaseDirectionIcon from "../DirectionIcon";
import { toModeBorderColor } from "../../utils/mode";

export const LegBody = styled.div`
  padding: 15px 0 15px 15px;
`;

export const StepsHeader = styled(ClearButton).attrs(props => ({
  "aria-pressed": props.expanded
}))`
  padding: 5px;
`;

export const ExpandIcon = styled(BaseExpandIcon).attrs(props => ({
  width: 10,
  height: 10,
  fill: toModeBorderColor(props.mode)
}))`
  padding-left: 5px;
`;

export const AccessLegSummary = styled(ClearButton).attrs(props => ({
  "aria-pressed": props.expanded
}))`
  width: 100%;
  font-size: 1.1em;
`;

export const AccessStepsListWrapper = styled.div`
  overflow: hidden;
  height: auto;
  max-height: ${props => (props.expanded === "true" ? "1000px" : "0")};
  transition: max-height 1s ease-in-out;
`;

export const AccessStepsList = styled.div`
  padding: 5px;
`;

export const AccessStepRow = styled.div`
  flex-flow: row;
  display: flex;
`;

export const StepDirectionIconColumn = styled.div`
  flex: 0 0 20px;
`;

export const StepDirectionDetailsColumn = styled.div`
  flex: 1 1 auto;
`;

export const StepDirectionIcon = styled(BaseDirectionIcon).attrs(props => ({
  width: 15,
  height: 15,
  fill: props.theme.primaryFontColor
}))``;

export const StepStreetName = styled.span`
  font-weight: bold;
`;
