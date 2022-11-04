import React, { FC } from "react";
import styled from "styled-components";

import { IconContainerProps, InnerCaret, OuterCaret } from "./styled";

interface CaretOptions {
  height?: number;
  offset?: number;
  position?: "inner" | "outer";
  width?: number;
}

/**
 * Adds a caret to a component.
 */
export default function withCaret(
  Component: FC<IconContainerProps>,
  options?: CaretOptions
): FC<IconContainerProps> {
  const isInner = options?.position === "inner";
  const height = options?.height || 0;
  const width = options?.width || height * 2;
  const halfWidth = width / 2;
  const offset = options?.offset || 0;
  const RawCaret = isInner ? InnerCaret : OuterCaret;
  const SizedCaret = height
    ? styled(RawCaret)`
        &::before {
          border-bottom-width: ${Math.max(0, height)}px;
          border-left-width: ${halfWidth}px;
          border-right-width: ${halfWidth}px;
          margin-left: -${halfWidth}px;
          top: -${offset + (isInner ? 0 : height)}px;
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
    style,
    vehicle
  }: IconContainerProps): JSX.Element => (
    <Component className={className} style={style} vehicle={vehicle}>
      {children}
      <SizedCaret rotate={vehicle.heading} />
    </Component>
  );

  return WrappedComponent;
}
