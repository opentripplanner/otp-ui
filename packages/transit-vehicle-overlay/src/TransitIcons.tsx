import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { Bus, Streetcar, Ferry } from "@opentripplanner/icons";
import styled, { css } from "styled-components";

const getBackgroundColor = routeColor => routeColor || "#9999ee";

const rounded = css<{
  ambient?: boolean;
  rotate?: number;
  routeColor?: string;
}>`
  background: ${props =>
    props.ambient ? getBackgroundColor(props.routeColor) : "#eeeeee"}aa;
  &:hover {
    background: ${props => getBackgroundColor(props.routeColor)}aa;
    cursor: ${props => (props.ambient ? "inherit" : "cell")};
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

export const StyledText = styled.div`
  ${rounded}
  font-size: 15px;
  font-weight: 700;
  height: inherit;
  margin: 0;
  padding: 5px 8px;
`;

export const getTransitIcon = (
  mode: string,
  forceText?: boolean
): React.ReactNode => {
  if (forceText) return StyledText;

  switch (mode?.toLowerCase()) {
    case "bus":
      return StyledBus;
    case "streetcar":
    case "tram":
    case "rail":
      return StyledStreetcar;
    case "ferry":
      return StyledFerry;
    default:
      return StyledText;
  }
};
