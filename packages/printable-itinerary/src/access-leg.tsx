import {
  Config,
  GradationMap,
  Leg,
  LegIconComponent,
  LegHeadingProp
} from "@opentripplanner/types";
import React, { ReactElement } from "react";
import AccessibilityAnnotation from "./accessibility-annotation";

import * as S from "./styled";

interface Props extends LegHeadingProp {
  accessibilityScoreGradationMap?: GradationMap;
  config: Config;
  leg: Leg;
  LegIcon: LegIconComponent;
}

export default function AccessLeg({
  accessibilityScoreGradationMap,
  config,
  leg,
  LegIcon,
  headingAs
}: Props): ReactElement {
  console.log("AccessLeg headingAs:", headingAs);
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
          headingAs={headingAs}
        />
        {!leg.rideHailingEstimate && (
          <S.LegDetails>
            {leg.steps.map((step, k) => (
              <S.LegDetail key={k}>
                <S.AccessLegStep step={step} units={config.units} />
              </S.LegDetail>
            ))}
          </S.LegDetails>
        )}
      </S.LegBody>
    </S.Leg>
  );
}
