import memoize from "lodash.memoize";
import coreUtils from "@opentripplanner/core-utils";
import { FC } from "react";
import styled, { css } from "styled-components";

import { VehicleComponentProps } from "./types";

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
const getForegroundColor = props => props.foregroundColor;

/**
 * Computes color props to simplify the CSS filler code.
 */
function getColorProps(options?: RouteColorBackgroundOptions) {
  const defaultColor = options?.defaultColor || "#9999ee";

  return (props: VehicleComponentProps): ColorProps => {
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
export const Circle = styled.div`
  background: #eee;
  border: 2px solid #333;
  /* Set an arbitrary large border radius so that the circle stays that way.
     (should render fine in Chromium, Firefox, and Safari) */
  border-radius: 10000px;
  cursor: default;
  height: 15px;
  line-height: 15px;
  padding: 15px;
  position: relative;
  text-align: center;
  transition: all 0.2s ease-in-out;
  width: 15px;
`;

/**
 * Displays a circle with contents that is rotated according to vehicle heading.
 */
export const RotatingCircle = styled(Circle)<VehicleComponentProps>`
  transform: rotate(${props => props.vehicle.heading || 0}deg);
`;

export const defaultCaretHeight = 5;
export const defaultCaretHalfWidth = 6;

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
    border-bottom: ${defaultCaretHeight}px solid #333;
    border-left: ${defaultCaretHalfWidth}px solid transparent;
    border-right: ${defaultCaretHalfWidth}px solid transparent;
    content: "";
    height: 0;
    left: 50%;
    margin-left: ${-defaultCaretHalfWidth}px;
    position: absolute;
    top: 0px;
    width: 0;
  }
`;

// Inner/OuterCaret are used for determining whether to apply foreground color with route colors.
export const InnerCaret = styled(Caret)``;

export const OuterCaret = styled(Caret)`
  &::before {
    top: ${-defaultCaretHeight}px;
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
  options?: RouteColorBackgroundOptions
): FC {
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

/**
 * Generate and memoize a container component once per set of container/pixels/padding parameters.
 */
export const getStyledContainer = memoize(
  (
    IconContainer: FC<VehicleComponentProps>,
    padding: number,
    pixels: number
  ) => {
    return styled(IconContainer)<VehicleComponentProps>`
      height: ${pixels}px;
      line-height: ${pixels}px;
      padding: ${padding}px;
      width: ${pixels}px;
    `;
  }
);
