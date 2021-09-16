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
   * Title as used by styled-icons. If left blank defaults to either
   * `From Location Icon` or `To Location Icon`.
   * See https://github.com/jacobwgillespie/styled-icons#props
   */
  title?: string;
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
  title = "",
  type = ""
}: Props): ReactElement {
  switch (type) {
    case "from":
      return (
        <S.FromIcon
          className={className}
          size={size}
          title={title || "From Location Icon"}
        />
      );
    case "to":
      return (
        <S.ToIcon
          className={className}
          size={size}
          title={title || "To Location Icon"}
        />
      );
    default:
      return (
        <S.PlaceIcon
          className={className}
          size={size}
          title={title || "Location Icon"}
        />
      );
  }
}

export default LocationIcon;

// Rename styled components for export
export { S as Styled };
