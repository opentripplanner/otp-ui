import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import RouteLongName from "../defaults/route-long-name";
import * as S from "../styled";
import { RouteDescriptionProps } from "../types";
import { defaultMessages } from "../util";

export default function RouteDescription({
  leg,
  LegIcon
}: RouteDescriptionProps): ReactElement {
  const { routeShortName } = leg;
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
      <S.InvisibleAdditionalDetails>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TransitLegBody.zoomToLeg"]}
          id="otpUi.TransitLegBody.zoomToLeg"
          description="Identifies behavior of clickable leg"
        />
      </S.InvisibleAdditionalDetails>
    </S.LegDescriptionForTransit>
  );
}
