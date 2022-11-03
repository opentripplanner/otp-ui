import React, { FC } from "react";
import styled from "styled-components";

import { IconContainerProps, InnerCaret, OuterCaret } from "./styled";

interface CaretOptions {
  pixels?: number;
  position?: "inner" | "outer";
}

/**
 * Adds a caret to a component.
 */
export default function withCaret(
  Component: FC<IconContainerProps>,
  options: CaretOptions
): FC<IconContainerProps> {
  const isInner = options?.position === "inner";
  const caretPx = options?.pixels || 0;
  const RawCaret = isInner ? InnerCaret : OuterCaret;
  const SizedCaret = caretPx
    ? styled(RawCaret)`
        &::before {
          border-bottom: ${Math.max(0, caretPx - 1)}px solid #333;
          border-left: ${caretPx}px solid transparent;
          border-right: ${caretPx}px solid transparent;
          margin-left: -${caretPx}px;
          top: -${isInner ? 0 : caretPx}px;
        }
      `
    : RawCaret;

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
      <SizedCaret rotate={vehicle.heading} />
    </Component>
  );

  return WrappedComponent;
}
