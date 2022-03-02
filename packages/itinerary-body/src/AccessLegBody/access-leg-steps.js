import { DirectionIcon } from "@opentripplanner/icons";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Step } from "@opentripplanner/types";

import * as S from "../styled";
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
  return <S.StepStreetName>{streetName}</S.StepStreetName>;
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
    <S.Steps>
      {steps.map(
        ({ absoluteDirection, lat, lon, relativeDirection, streetName }, k) => (
          <S.StepRow key={k}>
            <S.StepIconContainer>
              <DirectionIcon relativeDirection={relativeDirection} />
            </S.StepIconContainer>

            <S.StepDescriptionContainer>
              <FormattedMessage
                defaultMessage="{relativeDirection} {absoluteDirection} on <strong>{streetName}</strong>"
                description="Describes a step of the directions to reach a destination."
                id="otpUi.AccessLegBody.step"
                values={{
                  absoluteDirection,
                  relativeDirection,
                  streetName,
                  strong: renderStreetName
                }}
              />

              <MapillaryButton
                clickCallback={mapillaryCallback}
                coords={{ lat, lon }}
                mapillaryKey={mapillaryKey}
                padLeft
              />
            </S.StepDescriptionContainer>
          </S.StepRow>
        )
      )}
    </S.Steps>
  );
}
