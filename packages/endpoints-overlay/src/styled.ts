import LocationIcon from "@opentripplanner/location-icon";
import styled, { css } from "styled-components";
import { Circle } from "@styled-icons/fa-solid/Circle";

export const Button = styled.button`
  background: none;
  border: none;
  color: navy;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding-left: 0.2em;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const stacked = css`
  cursor: pointer;
  left: 0;
  position: absolute;
`;

export const StackedCircle = styled(Circle)`
  color: #fff;
  ${stacked}
`;

export const StackedLocationIcon = styled(LocationIcon)`
  ${stacked}
`;

export const StackedToIcon = styled(StackedLocationIcon)`
  color: #333;
  margin-left: -3px;
  margin-top: -2px;
`;

export const StackedIconContainer = styled.span`
  display: inline-block;
  height: 20px;
  margin-top: 2px;
  width: 20px;
`;

export const ToIcon = styled(LocationIcon)`
  ${stacked}
`;

export const IconWrapper = styled.span`
  &::after {
    content: "";
    margin: 0 0.125em;
  }
`;
