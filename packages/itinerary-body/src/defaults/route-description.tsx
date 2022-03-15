import { Leg } from "@opentripplanner/types";
import React, { ReactElement } from "react";

import * as S from "../styled";

import RouteLongName from "./route-long-name";

interface Props {
  leg: Leg;
}

export default function RouteDescription({ leg }: Props): ReactElement {
  const { routeShortName } = leg;
  return (
    <S.LegDescriptionForTransit>
      {routeShortName && (
        <div>
          <S.LegDescriptionRouteShortName>
            {routeShortName}
          </S.LegDescriptionRouteShortName>
        </div>
      )}
      <RouteLongName leg={leg} />
    </S.LegDescriptionForTransit>
  );
}
