import React, { ReactElement } from "react";

import * as S from "../styled";
import * as mock from "../__mocks__/route-description-footer/route-description-footer-props.json";
import { RouteDescriptionFooterProps } from "../types";

export default function DefaultRouteDescriptionFooter({
  leg,
  arrivalText = mock.default.arrivalText,
  arrivalTripId = leg.tripId,
  navigateToArrivalVehicle = () => null
}: RouteDescriptionFooterProps): ReactElement {
  const { tripId } = leg;
  return arrivalText && tripId === arrivalTripId ? (
    <S.ArrivalTimeContainer
      onClick={() => {
        navigateToArrivalVehicle();
      }}
    >
      <S.TrackerIcon />
      {arrivalText}
    </S.ArrivalTimeContainer>
  ) : null;
}
