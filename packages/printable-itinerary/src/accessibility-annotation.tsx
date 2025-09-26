import { AccessibilityRating } from "@opentripplanner/itinerary-body";
import { GradationMap, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";

import * as S from "./styled";

interface Props {
  accessibilityScoreGradationMap?: GradationMap;
  grayscale?: boolean;
  leg: Leg;
  LegIcon: LegIconComponent;
}

export default function AccessibilityAnnotation({
  accessibilityScoreGradationMap,
  grayscale,
  leg,
  LegIcon
}: Props): ReactElement {
  return (
    <S.LegAnnotation>
      <S.ModeIcon>
        <LegIcon leg={leg} />
      </S.ModeIcon>
      {leg.accessibilityScore !== null && leg.accessibilityScore > -1 && (
        <AccessibilityRating
          gradationMap={accessibilityScoreGradationMap}
          grayscale={grayscale}
          isLeg
          score={leg.accessibilityScore}
        />
      )}
    </S.LegAnnotation>
  );
}
