import React, { ReactElement } from "react";
import { differenceInMinutes } from "date-fns";
import { Leg } from "@opentripplanner/types";
import * as S from "../styled";
import { RouteDescriptionFooterProps } from "../types";

export default function DefaultRouteDescriptionFooter({
  navigateToArrivalVehicle = () => null,
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

export function makeRouteDescriptionFooter(): (props: {
  leg: Leg;
}) => JSX.Element {
  const NewComponent = ({ leg }: { leg: Leg }) => {
    const toTime = leg.to.arrival;
    const fromTime = leg.from.arrival;
    const waitMinutes = differenceInMinutes(
      new Date(toTime),
      new Date(fromTime)
    );
    return (
      <DefaultRouteDescriptionFooter leg={leg} waitMinutes={waitMinutes} />
    );
  };

  return NewComponent;
}
