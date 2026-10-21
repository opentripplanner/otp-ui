import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";

import { useIntl } from "react-intl";
import RouteLongName from "../defaults/route-long-name";
import * as S from "../styled";
import { RouteDescriptionProps } from "../types";

const { getLegRouteName } = coreUtils.itinerary;

export default function RouteDescription({
  leg,
  LegIcon
}: RouteDescriptionProps): ReactElement {
  const intl = useIntl();
  const routeShortName = getLegRouteName(leg, intl);
  return (
    <S.LegDescriptionForTransit>
      <S.LegIconAndRouteShortName>
        <S.LegIconContainer>
          <LegIcon leg={leg} />
        </S.LegIconContainer>
        {routeShortName && (
          <S.LegDescriptionRouteShortName>
            {routeShortName}
          </S.LegDescriptionRouteShortName>
        )}
      </S.LegIconAndRouteShortName>
      <S.LegDescriptionRouteLongName>
        <RouteLongName leg={leg} />
      </S.LegDescriptionRouteLongName>
    </S.LegDescriptionForTransit>
  );
}
