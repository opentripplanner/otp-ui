import coreUtils from "@opentripplanner/core-utils";
import { DirectionIcon } from "@opentripplanner/icons";
import React from "react";

import * as Styled from "../styled";

export default function AccessLegSteps({ steps }) {
  return (
    <Styled.Steps>
      {steps.map((step, k) => {
        return (
          <Styled.StepRow key={k}>
            <Styled.StepIconContainer>
              <DirectionIcon relativeDirection={step.relativeDirection} />
            </Styled.StepIconContainer>

            <Styled.StepDescriptionContainer>
              {coreUtils.itinerary.getStepDirection(step)}
              <span>
                {step.relativeDirection === "ELEVATOR" ? " to " : " on "}
              </span>
              <Styled.StepStreetName>
                {coreUtils.itinerary.getStepStreetName(step)}
              </Styled.StepStreetName>
            </Styled.StepDescriptionContainer>
          </Styled.StepRow>
        );
      })}
    </Styled.Steps>
  );
}

AccessLegSteps.propTypes = {
  steps: coreUtils.types.stepsType.isRequired
};
