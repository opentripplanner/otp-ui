import { Leg } from "@opentripplanner/types";
import React, { FunctionComponent, ReactElement } from "react";

import RouteLongName from "../defaults/route-long-name";
import * as S from "../styled";

interface Props {
  leg: Leg;
  LegIcon: FunctionComponent<{ leg: Leg }>;
}

export default function RouteDescription({
  leg,
  LegIcon
}: Props): ReactElement {
  const { routeShortName } = leg;
  return (
    <S.LegDescriptionForTransit>
      <S.LegIconContainer>
        <LegIcon leg={leg} />
      </S.LegIconContainer>
      {routeShortName && (
        <S.LegDescriptionRouteShortName>
          {routeShortName}
        </S.LegDescriptionRouteShortName>
      )}
      <RouteLongName leg={leg} />
    </S.LegDescriptionForTransit>
  );
}
