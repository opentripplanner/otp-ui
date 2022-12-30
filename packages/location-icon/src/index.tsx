import React, { ReactElement } from "react";
import { injectIntl, IntlShape } from "react-intl";

import * as S from "./styled";

type Props = {
  className?: string;
  intl: IntlShape;
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
  intl,
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
          title={title || intl.formatMessage({ id: "otpUi.LocationIcon.from" })}
        />
      );
    case "to":
      return (
        <S.ToIcon
          className={className}
          size={size}
          title={title || intl.formatMessage({ id: "otpUi.LocationIcon.to" })}
        />
      );
    default:
      return (
        <S.PlaceIcon
          className={className}
          size={size}
          title={
            title ||
            intl.formatMessage({ id: "otpUi.LocationIcon.locationIcon" })
          }
        />
      );
  }
}

export default injectIntl(LocationIcon);

// Rename styled components for export
export { S as Styled };
