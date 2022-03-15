import { FunctionComponent } from "react";

import { Leg, TransitOperator } from "@opentripplanner/types";

export interface RouteDescriptionProps {
  leg: Leg;
  LegIcon: FunctionComponent<{ leg: Leg }>;
  transitOperator: TransitOperator;
}

export type LegIconComponent = FunctionComponent<{
  leg: Leg;
  title?: string;
  width?: string;
}>;
