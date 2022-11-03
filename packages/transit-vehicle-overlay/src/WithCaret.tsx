import React, { FC } from "react";

import { IconContainerProps, InnerCaret, OuterCaret } from "./styled";

/**
 * Adds a caret to a component.
 */
export default function withCaret(
  Component: FC<IconContainerProps>,
  isOuter: boolean
): FC<IconContainerProps> {
  const Caret = isOuter ? OuterCaret : InnerCaret;

  /**
   * Displays a circle, content, and an arrow pointing in the direction
   * the specified transit vehicle is heading.
   */
  const WrappedComponent = ({
    className,
    children,
    padding,
    pixels,
    style,
    vehicle
  }: IconContainerProps): JSX.Element => (
    <Component
      className={className}
      padding={padding}
      pixels={pixels}
      style={style}
      vehicle={vehicle}
    >
      {children}
      <Caret rotate={vehicle.heading} />
    </Component>
  );

  return WrappedComponent;
}
