// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { DirectionIcon } from "@opentripplanner/icons";
import { Step, UnitSystem } from "@opentripplanner/types";
import React, { ReactElement } from "react";

import * as S from "../styled";
import AccessLegStep from "../defaults/access-leg-step";

import MapillaryButton from "./mapillary-button";

interface Props {
  mapillaryCallback?: (id: string) => void;
  mapillaryKey?: string;
  steps: Step[];
  units: UnitSystem;
}

/**
 * Renders a turn-by-turn step of an access leg.
 */
export default function AccessLegSteps({
  mapillaryCallback,
  mapillaryKey,
  steps,
  units
}: Props): ReactElement {
  return (
    <S.Steps>
      {steps.map((step, k) => {
        const { lat, lon, relativeDirection } = step;
        return (
          <S.StepRow key={k}>
            <S.StepIconContainer>
              <DirectionIcon relativeDirection={relativeDirection} />
            </S.StepIconContainer>

            <S.StepDescriptionContainer>
              <AccessLegStep step={step} units={units} />
              <MapillaryButton
                clickCallback={mapillaryCallback}
                coords={{ lat, lon }}
                mapillaryKey={mapillaryKey}
              />
            </S.StepDescriptionContainer>
          </S.StepRow>
        );
      })}
    </S.Steps>
  );
}
