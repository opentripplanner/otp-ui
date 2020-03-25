import {
  getStepDirection,
  getStepStreetName
} from "@opentripplanner/core-utils/lib/itinerary";
import { stepsType } from "@opentripplanner/core-utils/lib/types";
import { DirectionIcon } from "@opentripplanner/icons/lib/directions";
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
              {getStepDirection(step)}
              <span>
                {step.relativeDirection === "ELEVATOR" ? " to " : " on "}
              </span>
              <Styled.StepStreetName>
                {getStepStreetName(step)}
              </Styled.StepStreetName>
            </Styled.StepDescriptionContainer>
          </Styled.StepRow>
        );
      })}
    </Styled.Steps>
  );
}

AccessLegSteps.propTypes = {
  steps: stepsType.isRequired
};
