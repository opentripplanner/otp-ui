/* eslint-disable import/prefer-default-export */
import React, { ReactElement } from "react";
import * as S from "../styled";
import { RouteDescriptionFooterProps } from "../types";

export function DefaultRouteDescriptionFooter({
  navigateToArrivalVehicle = null,
  waitMinutes
}: RouteDescriptionFooterProps): ReactElement {
  return (
    <S.ArrivalTimeContainer
      onClick={() => {
        navigateToArrivalVehicle();
      }}
    >
      Arrives in {waitMinutes} minutes
    </S.ArrivalTimeContainer>
  );
}
