import {
  Defaults,
  Styled as ItinBodyClasses
} from "@opentripplanner/itinerary-body";
import styled from "styled-components";

export const Leg = styled.div`
  margin-bottom: 10px;
  border-top: 1px solid grey;
  padding-top: 18px;
  display: flex;
`;

export const CollapsedTop = styled(Leg)`
  border-top: none;
  padding-top: 0;
`;

export const LegBody = styled.div`
  margin-left: 10px;
`;

export const LegDetail = styled.div`
  font-size: 14px;
  margin-top: 3px;
`;

export const LegDetails = styled.div`
  margin-top: 5px;
`;

// TODO Refactor
export const LegHeader = styled.div`
  font-size: 18px;
`;

export const AccessLegDescription = styled(Defaults.AccessLegDescription)`
  font-size: 18px;

  ${ItinBodyClasses.LegDescriptionMode},
  ${ItinBodyClasses.LegDescriptionPlace} {
    font-weight: bold;
  }
`;

export const LegAnnotation = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 70px;
`;

export const AccessLegStep = styled(Defaults.AccessLegStep)`
  ${ItinBodyClasses.StepStreetName} {
    font-weight: bold;
  }
`;

export const ModeIcon = styled.div`
  float: left;
  width: 32px;
  height: 32px;
`;

export const PrintableItinerary = styled.div``;
