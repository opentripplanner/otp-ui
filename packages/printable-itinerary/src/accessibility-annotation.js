import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import PropTypes from "prop-types";

import { AccessibilityRating } from "@opentripplanner/itinerary-body";
import * as S from "./styled";

const AccessibilityAnnotation = ({
  accessibilityScoreGradationMap,
  grayscale,
  LegIcon,
  leg
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
    text: PropTypes.string,
    icon: PropTypes.element
  }).isRequired,
  grayscale: PropTypes.bool,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};

AccessibilityAnnotation.defaultProps = {
  grayscale: false
};

export default AccessibilityAnnotation;
