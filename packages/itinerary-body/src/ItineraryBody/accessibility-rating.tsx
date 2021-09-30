import React from "react";
import styled from "styled-components";
import { Wheelchair } from "@styled-icons/foundation/Wheelchair";

interface WrapperProps {
  color: string;
  large: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  align-items: center;
  background-color: ${props => props.color};
  border-radius: ${props => (props.large ? "4px" : "20px")};
  display: flex;
  justify-content: space-between;
  margin-top: 0.25em;
  max-height: 50px;
  padding: 0.25em 0.6em 0.25em 0.4em;
  width: ${props => (props.large ? "65px" : "50px")};
  word-wrap: anywhere; /* this can often look quite bad, but helps encourage icons */
`;
const StatusWrapper = styled.span`
  flex: 1;

  span {
    display: block;
  }
`;

const TextWrapper = styled.span`
  padding-top: 3px;
  font-weight: 600;
`;

/**
 * Component which renders a label with a color and icon depending on
 * a given accessibility score. The color and icon are set by a given gradation map.
 */
const AccessibilityRating = ({
  gradationMap,
  large = false,
  score
}: {
  gradationMap?: Record<
    number,
    { color: string; icon?: JSX.Element; text?: string }
  >;
  large: boolean;
  score: number;
}): JSX.Element => {
  // Provide default mapping
  const mapping = gradationMap || {
    0.0: { color: "#ffe4e5", text: "❌" },
    0.5: {
      color: "#dbe9ff",
      text: "？"
    },
    0.9: { color: "#bfffb5", text: "✅" }
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

  return (
    <Wrapper large={large} color={mapped.color} title={mapped.text}>
      <Wheelchair style={{ flex: "2", minWidth: "20px" }} />
      <StatusWrapper>
        {/* Show either icon or text if no icon given */}
        {mapped.icon || <TextWrapper>{mapped.text}</TextWrapper>}
      </StatusWrapper>
    </Wrapper>
  );
};

export default AccessibilityRating;
