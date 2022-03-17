import React, { ReactElement } from "react";

import * as S from "../styled";

interface Props {
  color?: string;
  abbreviation?: string;
  name: string;
}

export default function RouteBadge({
  color = "#084c8d",
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
