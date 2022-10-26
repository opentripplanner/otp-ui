import { FC } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { Bus, Streetcar, Ferry } from "@opentripplanner/icons";
import styled from "styled-components";
import { TransitVehicle } from "@opentripplanner/types";

export interface TransitIconProps {
  pixels?: number;
  rotate?: number;
  routeColor?: string;
}

export interface IconContainerProps {
  children: React.ReactNode;
  padding?: number;
  pixels?: number;
  /**
   * The transit vehicle for which to render a symbol.
   */
  vehicle: TransitVehicle;
}

export const StyledBus = styled(Bus)``;
export const StyledStreetcar = styled(Streetcar)``;
export const StyledFerry = styled(Ferry)``;

const getPixels = props => props.pixels || 15;
const getPadding = props => props.padding || 5;

/**
 * Displays a circle with basic settings.
 */
export const Circle = styled.div<TransitIconProps>`
  background: #eee;
  border: 2px solid #333;
  border-radius: ${getPixels}px;
  height: ${getPixels}px;
  line-height: ${getPixels}px;
  padding: ${getPadding}px;
  position: relative;
  text-align: center;
  transition: all 0.1s ease-in-out;
  width: ${getPixels}px;

  &:hover {
    background: ${props => props.routeColor || "#9999ee"};
    cursor: default;
  }
`;

/**
 * Displays a circle with contents that is rotated according to vehicle heading.
 */
export const RotatingCircle = styled(Circle)<IconContainerProps>`
  transform: rotate(${props => props.vehicle.heading || 0}deg);
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
    top: 0px;
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
