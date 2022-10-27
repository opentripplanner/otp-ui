import React from "react";

import { Caret, Circle, IconContainerProps } from "./TransitIcons";

/**
 * Displays a circle, content, and an arrow pointing in the direction
 * the specified transit vehicle is heading.
 */
export default function CircleWithCaret({
  className,
  children,
  pixels,
  style,
  vehicle
}: IconContainerProps): JSX.Element {
  return (
    <Circle
      className={className}
      pixels={pixels}
      routeColor={vehicle.routeColor}
      style={style}
    >
      {children}
      <Caret rotate={vehicle.heading} />
    </Circle>
  );
}
