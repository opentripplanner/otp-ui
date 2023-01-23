import { Config, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { AccessLegDescription } from "../defaults";
import { defaultMessages } from "../util";

import * as S from "../styled";

interface Props {
  config: Config;
  leg: Leg;
  LegIcon: LegIconComponent;
  onSummaryClick: () => void;
  showLegIcon: boolean;
}

export default function AccessLegSummary({
  config,
  leg,
  LegIcon,
  onSummaryClick,
  showLegIcon
}: Props): ReactElement {
  return (
    <S.LegClickable onClick={onSummaryClick}>
      <S.LegDescription>
        <S.LegIconAndRouteShortName>
          {showLegIcon && (
            <S.LegIconContainer>
              <LegIcon leg={leg} />
            </S.LegIconContainer>
          )}
        </S.LegIconAndRouteShortName>
        <AccessLegDescription config={config} leg={leg} />
      </S.LegDescription>
      <S.AccessibilityLinkDetails>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TransitLegBody.zoomToLeg"]}
          id="otpUi.TransitLegBody.zoomToLeg"
        />
      </S.AccessibilityLinkDetails>
    </S.LegClickable>
  );
}
