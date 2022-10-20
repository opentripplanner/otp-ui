import { FC } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { Bus, Streetcar, Ferry } from "@opentripplanner/icons";
import styled from "styled-components";

interface TransitIconProps {
  rotate?: number;
  routeColor?: string;
}

export const StyledBus = styled(Bus)``;
export const StyledStreetcar = styled(Streetcar)``;
export const StyledFerry = styled(Ferry)``;

export const Circle = styled.div<TransitIconProps>`
  background: #eee;
  border: 2px solid #333;
  border-radius: 40px;
  height: 20px;
  padding: 5px;
  transition: all 0.1s ease-in-out;
  width: 20px;

  &:hover {
    background: ${props => props.routeColor || "#9999ee"};
    cursor: default;
  }
`;

export const Caret = styled.div<TransitIconProps>`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transform: rotate(${props => props.rotate || 0}deg);
  width: 100%;

  &::before {
    border-bottom: 5px solid #333;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    content: "";
    height: 0;
    left: 50%;
    margin-left: -6px;
    position: absolute;
    top: 2px;
    width: 0;
  }
`;

export const getTransitIcon = (mode: string): FC => {
  switch (mode) {
    case "bus":
      return StyledBus;
    case "streetcar":
    case "rail":
      return StyledStreetcar;
    case "ferry":
      return StyledFerry;
    default:
      return StyledBus;
  }
};
