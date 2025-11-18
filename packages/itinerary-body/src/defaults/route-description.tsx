import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";

import * as S from "../styled";
import { RouteDescriptionProps } from "../types";

import RouteLongName from "./route-long-name";

const { getLegRouteShortName } = coreUtils.itinerary;

export default function RouteDescription({
  leg
}: RouteDescriptionProps): ReactElement {
  const routeShortName = getLegRouteShortName(leg);
  return (
    <S.LegDescriptionForTransit>
      {routeShortName && (
        <div>
          <S.LegDescriptionRouteShortName>
            {routeShortName}
          </S.LegDescriptionRouteShortName>
        </div>
      )}
      <S.LegDescriptionRouteLongName>
        <RouteLongName leg={leg} />
      </S.LegDescriptionRouteLongName>
    </S.LegDescriptionForTransit>
  );
}
