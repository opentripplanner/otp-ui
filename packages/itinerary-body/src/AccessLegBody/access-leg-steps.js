import coreUtils from "@opentripplanner/core-utils";
import { DirectionIcon } from "@opentripplanner/icons";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Step } from "@opentripplanner/types";

import * as Styled from "../styled";
import MapillaryButton from "./mapillary-button";

interface Props {
  mapillaryCallback?: (id: string) => void;
  mapillaryKey?: string;
  steps: Step[];
}

/**
 * Applies the appropriate style for street names.
 */
function renderStreetName(streetName) {
  return <Styled.StepStreetName>{streetName}</Styled.StepStreetName>;
}

/**
 * Renders a turn-by-turn step of an access leg.
 */
export default function AccessLegSteps({
  steps,
  mapillaryCallback,
  mapillaryKey
}: Props): ReactElement {
  return (
    <Styled.Steps>
      {steps.map((step, k) => (
        <Styled.StepRow key={k}>
          <Styled.StepIconContainer>
            <DirectionIcon relativeDirection={step.relativeDirection} />
          </Styled.StepIconContainer>

          <Styled.StepDescriptionContainer>
            <FormattedMessage
              description="Describes a step of the directions to reach a destination."
              id="otpUi.AccessLegBody.instruction"
              values={{
                // FIXME: Include absolute dirs in translations.
                absoluteDirection: step.absoluteDirection,
                // FIXME: Include "unnamed roads/paths" in translations.
                destination: coreUtils.itinerary.getStepStreetName(step),
                relativeDirection: step.relativeDirection,
                strong: renderStreetName
              }}
            />

            <MapillaryButton
              clickCallback={mapillaryCallback}
              coords={step}
              mapillaryKey={mapillaryKey}
              padLeft
            />
          </Styled.StepDescriptionContainer>
        </Styled.StepRow>
      ))}
    </Styled.Steps>
  );
}
