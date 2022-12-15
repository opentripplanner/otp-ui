import { Leg } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  leg: Leg;
  /** If true, hides route_long_name in transit legs, only showing headsign. */
  onlyShowHeadsign?: boolean;
}

/**
 * Helper function to format the "to" separator.
 */
function toPrefix(contents: ReactElement): ReactElement {
  return (
    <S.LegDescriptionHeadsignPrefix>{contents}</S.LegDescriptionHeadsignPrefix>
  );
}

export default function RouteLongName({
  className,
  leg,
  style,
  onlyShowHeadsign
}: Props): ReactElement {
  const { headsign, routeLongName } = leg;
  return (
    <span className={className} style={style}>
      {onlyShowHeadsign ? (
        headsign || routeLongName
      ) : headsign ? (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TransitLegBody.routeDescription"]
          }
          description="Displays the route name and destination"
          id="otpUi.TransitLegBody.routeDescription"
          values={{
            headsign,
            routeName: routeLongName,
            toPrefix
          }}
        />
      ) : (
        routeLongName
      )}
    </span>
  );
}
