import { Leg } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { compareTwoStrings } from "string-similarity";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  leg: Leg;
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
  style
}: Props): ReactElement {
  const { headsign, routeLongName } = leg;
  // Hide route long name if it contains similar information to the headsign
  const hideRouteLongName =
    compareTwoStrings(headsign || "", routeLongName || "") > 0.25 ||
    !routeLongName;
  return (
    <span className={className} style={style}>
      {!hideRouteLongName && headsign ? (
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
        headsign || routeLongName
      )}
    </span>
  );
}
