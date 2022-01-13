import coreUtils from "@opentripplanner/core-utils";
import { DirectionIcon } from "@opentripplanner/icons";
import React from "react";
import PropTypes from "prop-types";

import * as Styled from "../styled";
import MapillaryButton from "./mapillary-button";

export default function AccessLegSteps({
  steps,
  mapillaryCallback,
  mapillaryKey
}) {
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
              <MapillaryButton
                coords={[step.lat, step.lon]}
                clickCallback={mapillaryCallback}
                mapillaryKey={mapillaryKey}
                padLeft
              />
            </Styled.StepDescriptionContainer>
          </Styled.StepRow>
        );
      })}
    </Styled.Steps>
  );
}

AccessLegSteps.propTypes = {
  steps: coreUtils.types.stepsType.isRequired,
  mapillaryCallback: PropTypes.func,
  mapillaryKey: PropTypes.string
};

AccessLegSteps.defaultProps = {
  mapillaryCallback: null,
  mapillaryKey: null
};
