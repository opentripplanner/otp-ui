import { GradationMap } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import styled from "styled-components";
import { Wheelchair } from "@styled-icons/foundation/Wheelchair";
import { useIntl } from "react-intl";
import { InvisibleAdditionalDetails } from "../styled";

interface WrapperProps {
  border: boolean;
  color: string;
  large: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  align-items: center;
  border: ${props => (props.border ? "1px solid #333" : "none")};
  background-color: ${props => props.color};
  border-radius: ${props => (props.large ? "4px" : "20px")};
  display: flex;
  justify-content: space-between;
  margin-top: 0.25em;
  max-width: 75px;
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
  isLeg?: boolean;
  large?: boolean;
  score: number;
}

/**
 * Component which renders a label with a color and icon depending on
 * a given accessibility score. The color and icon are set by a given gradation map.
 */
const AccessibilityRating = ({
  gradationMap,
  grayscale = false,
  isLeg = false,
  large = false,
  score
}: Props): ReactElement => {
  const intl = useIntl();
  // Provide default mapping
  const mapping =
    gradationMap && Object.keys(gradationMap).length
      ? gradationMap
      : {
          0.0: {
            color: "#ffe4e5",
            icon: "❌",
            text: intl.formatMessage({
              id: `otpUi.ItineraryBody.tripAccessibility.inaccessible`
            })
          },
          0.5: {
            color: "#dbe9ff",
            icon: "？",
            text: intl.formatMessage({
              id: `otpUi.ItineraryBody.tripAccessibility.unclear`
            })
          },
          0.9: {
            color: "#bfffb5",
            icon: "✅",
            text: intl.formatMessage({
              id: `otpUi.ItineraryBody.tripAccessibility.likelyAccessible`
            })
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

  const accessibilityPreface = intl.formatMessage({
    id: `otpUi.ItineraryBody.tripAccessibility.${
      isLeg ? "legAccessibility" : "itineraryAccessibility"
    }`
  });

  const accessibilityScore = mapped.text;

  const accessibilityLabel = accessibilityPreface + accessibilityScore;

  return (
    <Wrapper
      border={grayscale}
      color={grayscale ? "transparent" : mapped.color}
      large={large}
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
