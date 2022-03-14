import React, { ReactElement } from "react";

import * as Styled from "../styled";

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
    <Styled.RouteBadge routeColor={color}>
      <Styled.SRHidden>{abbreviation}</Styled.SRHidden>
      <Styled.SROnly>{name}</Styled.SROnly>
    </Styled.RouteBadge>
  );
}
