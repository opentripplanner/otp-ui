import React from "react";
import styled from "styled-components";
import { Wheelchair } from "@styled-icons/foundation/Wheelchair";
import { ThumbsUp } from "@styled-icons/fa-regular/ThumbsUp";
import { ThumbsDown } from "@styled-icons/fa-regular/ThumbsDown";
import { QuestionCircle } from "@styled-icons/fa-regular/QuestionCircle";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.color};
  border-radius: 20px;
  padding: 0.25em 0.6em 0.25em 0.4em;
  margin-top: 0.25em;
`;
const StatusWrapper = styled.span`
  flex: 1;
`;

const AccessibilityRating = ({
  score,
  gradationMap
}: {
  score: number;
  gradationMap?: Record<
    number,
    { color: string; icon?: JSX.Element; text?: string }
  >;
}): JSX.Element => {
  // Provide default mapping
  const mapping = gradationMap || {
    0.0: { color: "#ffb5b9", icon: <ThumbsDown />, text: "Not Accessible" },
    0.5: {
      color: "#b5d1ff",
      icon: <QuestionCircle />,
      text: "Partly Accessible"
    },
    0.9: { color: "#bfffb5", icon: <ThumbsUp />, text: "Accessible" }
  };

  // Find the highest (including equality) key for our score.
  const mappedKey: number = parseFloat(
    Object.keys(mapping)
      .sort()
      .reverse()
      .find(key => parseFloat(key) <= score)
  );

  const mapped = mapping[mappedKey];

  return (
    <Wrapper color={mapped.color} title={mapped.text}>
      <Wheelchair style={{ flex: "2" }} />
      <StatusWrapper>
        {/* Show either icon or text if no icon given */}
        {mapped.icon || <h5>{mapped.text}</h5>}
      </StatusWrapper>
    </Wrapper>
  );
};

export default AccessibilityRating;
