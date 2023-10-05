import { GradationMap } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import styled from "styled-components";
import { Wheelchair } from "@styled-icons/foundation/Wheelchair";
import { IntlShape } from "react-intl";
import { InvisibleAdditionalDetails } from "../styled";

interface WrapperProps {
  border: boolean;
  color: string;
  leg: boolean;
  large: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  align-items: center;
  border: ${props => (props.border ? "1px solid #333" : "none")};
  background-color: ${props => props.color};
  border-radius: ${props => (props.large ? "4px" : "20px")};
  color: #676767;
  display: flex;
  grid-column: ${props => (props.leg ? 1 : "")};
  grid-row: ${props => (props.leg ? 2 : "")};
  justify-content: space-between;
  margin-top: -0.3em;
  max-width: 56px;
  font-size: 0.9em;
  height: ${props => (props.large ? "40px" : "30px")};
  padding: 0.25em 0.6em 0.25em 0.4em;
  word-wrap: anywhere; /* this can often look quite bad, but helps encourage icons */
`;
const StatusWrapper = styled.span`
  flex: 1;
  /* TODO: 0.25em negative margin to get centering correct? */

  span {
    display: block;
  }
`;

const TextWrapper = styled.span`
  padding-top: 3px;
  font-weight: 600;
`;

interface Props {
  gradationMap?: GradationMap;
  grayscale?: boolean;
  intl: IntlShape;
  large?: boolean;
  leg?: boolean;
  score: number;
}

/**
 * Component which renders a label with a color and icon depending on
 * a given accessibility score. The color and icon are set by a given gradation map.
 */
const AccessibilityRating = ({
  gradationMap,
  grayscale = false,
  intl,
  large = false,
  leg = false,
  score
}: Props): ReactElement => {
  // Provide default mapping
  const mapping = gradationMap || {
    0.0: {
      color: "#ffe4e5",
      text: "❌",
      labelId: "tripIsInaccessible"
    },
    0.5: {
      color: "#dbe9ff",
      text: "？",
      labelId: "tripAccessibilityUnclear"
    },
    0.9: {
      color: "#bfffb5",
      text: "✅",
      labelId: "tripIsLikelyAccessible"
    }
  };

  // Find the highest (including equality) key for our score.
  const mappedKey: number = parseFloat(
    Object.keys(mapping)
      .sort()
      // Start at the top, so the first one that is less/equal to our score is the correct label
      .reverse()
      .find(key => parseFloat(key) <= score)
  );

  // External configuration may report "0.0" as 0, so include fallback
  const mapped = mapping[mappedKey] || mapping[0.0];

  const accessibilityLabel = intl.formatMessage(
    {
      id: `otpUi.ItineraryBody.tripAccessibility.${mapped.labelId}`
    },
    { leg }
  );

  return (
    <Wrapper
      border={grayscale}
      color={grayscale ? "transparent" : mapped.color}
      large={large}
      leg
      title={accessibilityLabel}
    >
      <InvisibleAdditionalDetails>
        {accessibilityLabel}
      </InvisibleAdditionalDetails>
      <Wheelchair style={{ flex: "2", height: "100%", minWidth: "20px" }} />
      <StatusWrapper aria-hidden>
        {/* Show either icon or text if no icon given */}
        {mapped.icon || <TextWrapper>{mapped.text}</TextWrapper>}
      </StatusWrapper>
    </Wrapper>
  );
};

export default AccessibilityRating;
