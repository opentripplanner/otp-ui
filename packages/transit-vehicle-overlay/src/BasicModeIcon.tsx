import React, { ReactElement } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import Bus from "@opentripplanner/icons/lib/trimet/Bus";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import Ferry from "@opentripplanner/icons/lib/trimet/Ferry";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import Streetcar from "@opentripplanner/icons/lib/trimet/Streetcar";

/**
 * Fill-in type for the icons package.
 */
export interface ModeIconProps {
  mode?: string;
}

/**
 * Default, minimal mode icon renderer.
 */
export default function BasicModeIcon({ mode }: ModeIconProps): ReactElement {
  switch (mode?.toLowerCase()) {
    case "bus":
      return <Bus />;
    case "tram":
    case "streetcar":
    case "rail":
      return <Streetcar />;
    case "ferry":
      return <Ferry />;
    default:
      return null;
  }
}
