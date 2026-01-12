import React, { ReactElement } from "react";
import colors from "@opentripplanner/building-blocks";

import * as S from "../styled";

const { blue } = colors;

interface Props {
  color?: string;
  abbreviation?: string;
  name: string;
}

export default function RouteBadge({
  color = blue[900],
  abbreviation,
  name
}: Props): ReactElement {
  return (
    <S.RouteBadge routeColor={color}>
      <S.SRHidden>{abbreviation}</S.SRHidden>
      <S.SROnly>{name}</S.SROnly>
    </S.RouteBadge>
  );
}
