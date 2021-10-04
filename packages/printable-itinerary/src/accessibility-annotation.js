import coreUtils from "@opentripplanner/core-utils";
import { AccessibilityRating } from "@opentripplanner/itinerary-body";
import React from "react";
import PropTypes from "prop-types";

import * as S from "./styled";

const AccessibilityAnnotation = ({
  accessibilityScoreGradationMap,
  grayscale,
  leg,
  LegIcon
}) => (
  <S.LegAnnotation>
    <S.ModeIcon>
      <LegIcon leg={leg} />
    </S.ModeIcon>
    {leg.accessibilityScore && (
      <AccessibilityRating
        gradationMap={accessibilityScoreGradationMap}
        grayscale={grayscale}
        score={leg.accessibilityScore}
      />
    )}
  </S.LegAnnotation>
);
AccessibilityAnnotation.propTypes = {
  accessibilityScoreGradationMap: PropTypes.shape({
    color: PropTypes.string,
    icon: PropTypes.element,
    text: PropTypes.string
  }),
  grayscale: PropTypes.bool,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};

AccessibilityAnnotation.defaultProps = {
  accessibilityScoreGradationMap: undefined,
  grayscale: false
};

export default AccessibilityAnnotation;
