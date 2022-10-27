import React, { ReactElement } from "react";
import Bus from "@opentripplanner/icons/lib/trimet/Bus";
import Ferry from "@opentripplanner/icons/lib/trimet/Ferry";
import Streetcar from "@opentripplanner/icons/lib/trimet/Streetcar";

interface Props {
  mode?: string;
}

/**
 * Default, minimal mode icon renderer.
 */
export default function BasicModeIcon({ mode }: Props): ReactElement {
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
