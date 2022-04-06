import React, { ReactElement } from "react";
import { useIntl } from "react-intl";

import { PlaceNameProps } from "../types";
import { getPlaceName } from "../util";
import StayOnBoard from "./stay-on-board";

export default function BasicPlaceName({
  config,
  interline,
  place
}: PlaceNameProps): ReactElement {
  const intl = useIntl();
  return interline ? (
    <StayOnBoard place={place} />
  ) : (
    <>{getPlaceName(place, config.companies, intl)}</>
  );
}
