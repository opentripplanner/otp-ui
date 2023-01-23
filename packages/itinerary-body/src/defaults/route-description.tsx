import React, { ReactElement } from "react";

import * as S from "../styled";
import { RouteDescriptionProps } from "../types";

import RouteLongName from "./route-long-name";

export default function RouteDescription({
  leg
}: RouteDescriptionProps): ReactElement {
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
      <S.LegDescriptionRouteLongName>
        <RouteLongName leg={leg} />
      </S.LegDescriptionRouteLongName>
    </S.LegDescriptionForTransit>
  );
}
