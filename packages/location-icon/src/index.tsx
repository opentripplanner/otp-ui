import React, { ReactElement } from "react";

import * as S from "./styled";

type Props = {
  className?: string;
  /**
   * Can be either a number or a string.
   * See https://github.com/jacobwgillespie/styled-icons#props
   */
  size: number | string;
  /**
   * `from` or `to` or some other string value to trigger generic place icon.
   */
  type: string;
};

/**
 * LocationIcon provides a consistent icon for rendering from, to, or generic
 * place icons in form components like LocationField and in map overlays/popups.
 */
export function LocationIcon({
  className = "",
  size = 10,
  type = ""
}: Props): ReactElement {
  switch (type) {
    case "from":
      return <S.FromIcon className={className} size={size} />;
    case "to":
      return <S.ToIcon className={className} size={size} />;
    default:
      return <S.PlaceIcon className={className} size={size} />;
  }
}

export default LocationIcon;

// Rename styled components for export
export { S as Styled };
