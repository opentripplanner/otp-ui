import { Leg } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
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

export default function RouteLongName({ leg }: Props): ReactElement {
  const { headsign, routeLongName } = leg;
  return (
    <S.LegDescriptionRouteLongName>
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
    </S.LegDescriptionRouteLongName>
  );
}
