import { Place } from "@opentripplanner/types";
import React, { ReactElement } from "react";

import * as S from "../styled";

interface Props {
  stops: Place[];
}

export default function IntermediateStops({ stops }: Props): ReactElement {
  return (
    <S.IntermediateStops>
      {stops.map((stop, k) => (
        <S.StopRow key={k}>
          <S.StopMarker>&bull;</S.StopMarker>
          <S.StopName>{stop.name}</S.StopName>
        </S.StopRow>
      ))}
    </S.IntermediateStops>
  );
}
