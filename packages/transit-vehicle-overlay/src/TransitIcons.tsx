import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { Bus, Streetcar, Ferry } from "@opentripplanner/icons";
import styled, { css } from "styled-components";

const rounded = css<{
  highlightColor?: string;
  rotate?: number;
  routeColor?: string;
}>`
  background: ${props => props.routeColor || "#eeeeee"}aa;
  &:hover {
    background: ${props => props.highlightColor || "#9999ee"}aa;
    cursor: cell;
  }
  transition: all 0.1s ease-in-out;
  border: 2px solid #333d;
  border-radius: 40px;
  padding: 5px;
  height: 15px;
  transform: rotate(${props => props.rotate || 0}deg);
`;

export const StyledBus = styled(Bus)`
  ${rounded}
`;
export const StyledStreetcar = styled(Streetcar)`
  ${rounded}
`;
export const StyledFerry = styled(Ferry)`
  ${rounded}
`;

export const getTransitIcon = (mode: string): React.ReactNode => {
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
