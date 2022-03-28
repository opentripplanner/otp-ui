import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";
import AccessibilityAnnotation from "./accessibility-annotation";

import * as S from "./styled";

export default function AccessLeg({
  accessibilityScoreGradationMap,
  config,
  leg,
  LegIcon
}) {
  return (
    <S.Leg>
      <AccessibilityAnnotation
        accessibilityScoreGradationMap={accessibilityScoreGradationMap}
        grayscale
        leg={leg}
        LegIcon={LegIcon}
      />
      <S.LegBody>
        <S.AccessLegDescription config={config} leg={leg} />
        {!leg.hailedCar && (
          <S.LegDetails>
            {leg.steps.map((step, k) => (
              <S.LegDetail key={k}>
                <S.AccessLegStep step={step} />
              </S.LegDetail>
            ))}
          </S.LegDetails>
        )}
      </S.LegBody>
    </S.Leg>
  );
}

AccessLeg.propTypes = {
  accessibilityScoreGradationMap: PropTypes.shape({
    color: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.element
  }),
  config: coreUtils.types.configType.isRequired,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};

AccessLeg.defaultProps = {
  accessibilityScoreGradationMap: null
};
