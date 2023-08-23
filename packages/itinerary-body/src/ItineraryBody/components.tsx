import React, { ReactElement } from "react";
import { differenceInMinutes } from "date-fns";

import { Leg } from "@opentripplanner/types";
import { RouteDescriptionFooterProps } from "../types";
import { DefaultRouteDescriptionFooter } from "../defaults/route-description-footer";

const RouteDescriptionFooterWithWaitTimes = ({
  leg
}: {
  leg: Leg;
}): ReactElement => {
  const toTime = leg.to.arrival || 0;
  const fromTime = leg.from.arrival || 0;
  const waitMinutes = differenceInMinutes(new Date(toTime), new Date(fromTime));
  const TypedRouteDescriptionFooter = DefaultRouteDescriptionFooter as React.FC<
    RouteDescriptionFooterProps
  >;

  return <TypedRouteDescriptionFooter leg={leg} waitMinutes={waitMinutes} />;
};

export default RouteDescriptionFooterWithWaitTimes;
