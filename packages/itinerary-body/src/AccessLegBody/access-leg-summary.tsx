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
    <S.LegClickable>
      <S.LegDescription>
        <S.LegIconAndRouteShortName>
          {showLegIcon && (
            <S.LegIconContainer>
              <LegIcon leg={leg} />
            </S.LegIconContainer>
          )}
        </S.LegIconAndRouteShortName>
        <S.InvisibleAdditionalDetails> - </S.InvisibleAdditionalDetails>
        <AccessLegDescription config={config} leg={leg} />
        <S.LegClickableButton onClick={onSummaryClick}>
          <S.InvisibleAdditionalDetails>
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.TransitLegBody.zoomToLeg"]}
              description="Identifies behavior of button"
              id="otpUi.TransitLegBody.zoomToLeg"
            />
          </S.InvisibleAdditionalDetails>
        </S.LegClickableButton>
      </S.LegDescription>
    </S.LegClickable>
  );
}
