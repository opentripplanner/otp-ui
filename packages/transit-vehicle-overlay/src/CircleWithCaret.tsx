import React from "react";

import { Caret, Circle, IconContainerProps } from "./TransitIcons";

/**
 * Displays a circle, content, and an arrow pointing in the direction
 * the specified transit vehicle is heading.
 */
export default function CircleWithCaret({
  children,
  pixels,
  vehicle
}: IconContainerProps): JSX.Element {
  return (
    <Circle pixels={pixels} routeColor={vehicle.routeColor}>
      {children}
      <Caret rotate={vehicle.heading} />
    </Circle>
  );
}
