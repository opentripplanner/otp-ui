import { Config, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { AccessLegDescription } from "../defaults";

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
      {showLegIcon && (
        <S.LegIconContainer>
          <LegIcon leg={leg} />
        </S.LegIconContainer>
      )}

      <AccessLegDescription config={config} leg={leg} />
    </S.LegClickable>
  );
}
