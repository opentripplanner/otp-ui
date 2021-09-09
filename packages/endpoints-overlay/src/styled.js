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
  left: 0;
  position: absolute;
  text-align: center;
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
`;

export const StackedIconContainer = styled.span`
  display: inline-block;
  height: 2em;
  line-height: 2em;
  line-height: inherit;
  margin-left: -10px;
  margin-top: -7px;
  opacity: 1;
  position: relative;
  vertical-align: middle;
  width: 2em;
`;

export const ToIcon = styled(LocationIcon)`
  ${stacked}
  line-height: inherit;
  margin-left: 2px;
  margin-top: 2px;
`;
