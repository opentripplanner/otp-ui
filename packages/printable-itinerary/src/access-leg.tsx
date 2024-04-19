import {
  Config,
  GradationMap,
  Leg,
  LegIconComponent
} from "@opentripplanner/types";
import React, { ReactElement } from "react";
import AccessibilityAnnotation from "./accessibility-annotation";

import * as S from "./styled";

interface Props {
  accessibilityScoreGradationMap?: GradationMap;
  config: Config;
  leg: Leg;
  LegIcon: LegIconComponent;
  useMetricUnits?: boolean;
}

export default function AccessLeg({
  accessibilityScoreGradationMap,
  config,
  leg,
  LegIcon,
  useMetricUnits = false
}: Props): ReactElement {
  return (
    <S.Leg>
      <AccessibilityAnnotation
        accessibilityScoreGradationMap={accessibilityScoreGradationMap}
        grayscale
        leg={leg}
        LegIcon={LegIcon}
      />
      <S.LegBody>
        <S.AccessLegDescription
          config={config}
          leg={leg}
          useMetricUnits={useMetricUnits}
        />
        {!leg.rideHailingEstimate && (
          <S.LegDetails>
            {leg.steps.map((step, k) => (
              <S.LegDetail key={k}>
                <S.AccessLegStep step={step} useMetricUnits={useMetricUnits} />
              </S.LegDetail>
            ))}
          </S.LegDetails>
        )}
      </S.LegBody>
    </S.Leg>
  );
}
