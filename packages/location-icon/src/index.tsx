import * as React from "react";

import * as Styled from "./styled";

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
export const LocationIcon = ({
  className = "",
  size = 10,
  title = "",
  type = ""
}: Props): React.ReactElement => {
  switch (type) {
    case "from":
      return (
        <Styled.FromIcon
          className={className}
          size={size}
          title={title || "From Location Icon"}
        />
      );
    case "to":
      return (
        <Styled.ToIcon
          className={className}
          size={size}
          title={title || "To Location Icon"}
        />
      );
    default:
      return (
        <Styled.PlaceIcon
          className={className}
          size={size}
          title={title || "Location Icon"}
        />
      );
  }
};

export default LocationIcon;
