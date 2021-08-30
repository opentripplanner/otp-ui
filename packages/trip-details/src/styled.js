import styled from "styled-components";

const BaseButton = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  margin: 0;
  padding: 0;
  text-decoration: none;
  touch-action: manipulation;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
`;

export const CaloriesDescription = styled.span``;

export const CaloriesSummary = styled.span``;

export const ExpandButton = styled(BaseButton).attrs({
  "aria-label": "What does this mean?"
})`
  color: #00f;
  font-size: 16px;
  margin-left: 6px;
  margin-top: -2px;
`;

export const Fare = styled.span``;

export const HideButton = styled(BaseButton)`
  float: right;
`;

export const TNCFare = styled.span``;

export const TNCFareCompanies = styled.span`
  text-transform: capitalize;
`;

export const Timing = styled.span``;

export const TransitFare = styled.span``;

export const TripDetail = styled.div`
  margin-top: 6px;
`;

export const TripDetailDescription = styled.div`
  background-color: #fff;
  border: 1px solid #888;
  font-size: 12px;
  margin-top: 2px;
  padding: 8px;
`;

export const TripDetailIcon = styled.div`
  float: left;
  font-size: 17px;
`;

export const TripDetails = styled.div`
  background-color: #eee;
  border-radius: 6px;
  margin-bottom: 15px;
  margin-top: 16px;
  padding: 10px 16px;
`;

export const TripDetailsBody = styled.div``;

export const TripDetailsHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

export const TripDetailSummary = styled.div`
  margin-left: 28px;
  padding-top: 2px;
`;
