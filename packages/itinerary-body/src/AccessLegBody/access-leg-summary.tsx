import { Config, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { injectIntl, IntlShape } from "react-intl";
import { AccessLegDescription } from "../defaults";
import { defaultMessages } from "../util";

import * as S from "../styled";

interface Props {
  config: Config;
  intl: IntlShape;
  leg: Leg;
  LegIcon: LegIconComponent;
  onSummaryClick: () => void;
  showLegIcon: boolean;
}

function AccessLegSummary({
  config,
  intl,
  leg,
  LegIcon,
  onSummaryClick,
  showLegIcon
}: Props): ReactElement {
  return (
    <S.LegClickable
      onClick={onSummaryClick}
      aria-label={intl.formatMessage({
        defaultMessage: defaultMessages["otpUi.TransitLegBody.zoomToLeg"],
        description: "Identifies behavior of clickable leg",
        id: "otpUi.TransitLegBody.zoomToLeg"
      })}
    >
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
    </S.LegClickable>
  );
}

export default injectIntl(AccessLegSummary);
