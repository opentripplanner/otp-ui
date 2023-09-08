import React, { ReactElement } from "react";
import { differenceInMinutes } from "date-fns";
import { Leg } from "@opentripplanner/types";

import { RouteDescriptionFooterProps } from "../types";
import { DefaultRouteDescriptionFooter } from "../defaults/route-description-footer";

/**
 * This method returns a RouteDescriptionFooter element with falsy wait-times
 * generated from legs' to and from arrival-times. It is only meant for
 * illustrative purposes.
 */
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