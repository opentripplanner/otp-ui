import coreUtils from "@opentripplanner/core-utils";
import { FC, HTMLAttributes } from "react";
import styled, { css } from "styled-components";
import { TransitVehicle } from "@opentripplanner/types";

// Need this to find null or undefined values while not including zero which is a valid value.
import { isNull } from "./utils/strings";

export interface IconContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The padding around icons, in pixels.
   */
  padding?: number;
  /**
   * The size of the icon in pixels.
   */
  pixels?: number;
  /**
   * The transit vehicle for which to render a symbol.
   */
  vehicle: TransitVehicle;
}

interface RouteColorBackgroundOptions {
  /**
   * The alpha component of a color in hexadecimal.
   */
  alphaHex?: string;
  defaultColor?: string;
  display?: "fixed" | "onhover";
}

interface ColorProps {
  backgroundColor: string;
  foregroundColor: string;
}

// CSS helper functions.
const getPixels = props => (isNull(props.pixels) ? 15 : props.pixels);
const getPadding = props => (isNull(props.padding) ? 5 : props.padding);
const getForegroundColor = props => props.foregroundColor;

/**
 * Computes color props to simplify the CSS filler code.
 */
function getColorProps(options?: RouteColorBackgroundOptions) {
  const defaultColor = options?.defaultColor || "#9999ee";

  return (props: IconContainerProps): ColorProps => {
    const routeColor = props.vehicle.routeColor || defaultColor;
    return {
      backgroundColor: `${routeColor}${options?.alphaHex || ""}`,
      foregroundColor: coreUtils.route.getMostReadableTextColor(routeColor)
    };
  };
}

/**
 * Displays a circle with basic settings.
 */
export const Circle = styled.div<IconContainerProps>`
  background: #eee;
  border: 2px solid #333;
  border-radius: ${getPixels}px;
  cursor: default;
  height: ${getPixels}px;
  line-height: ${getPixels}px;
  padding: ${getPadding}px;
  position: relative;
  text-align: center;
  transition: all 0.2s ease-in-out;
  width: ${getPixels}px;
`;

/**
 * Displays a circle with contents that is rotated according to vehicle heading.
 */
export const RotatingCircle = styled(Circle)<IconContainerProps>`
  transform: rotate(${props => props.vehicle.heading || 0}deg);
`;

/**
 * Renders a caret that fits within another component and indicates the heading.
 */
export const Caret = styled.div<{ rotate: number }>`
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

export const InnerCaret = styled(Caret)``;

export const OuterCaret = styled(Caret)`
  &::before {
    top: -6px;
  }
`;

const routeColorBackgroundCss = css<ColorProps>`
  background: ${props => props.backgroundColor};
  color: ${getForegroundColor};
  & svg path,
  & svg text {
    fill: ${getForegroundColor};
  }
  /* Change the caret foreground color only if it is an inner caret
     (i.e. renders over the route color background being set above). */
  ${InnerCaret} {
    &::before {
      border-bottom-color: ${getForegroundColor};
    }
  }
`;

/**
 * Applies the vehicle's route color to a component
 * and a foreground color that is contrast-compatible with that color.
 */
export function withRouteColorBackground(
  Container: FC,
  options: RouteColorBackgroundOptions
): FC<IconContainerProps> {
  const innerCss =
    options?.display === "onhover"
      ? css`
          &:hover {
            ${routeColorBackgroundCss}
          }
        `
      : routeColorBackgroundCss;

  return styled(Container).attrs(getColorProps(options))`
    ${innerCss}
  `;
}
