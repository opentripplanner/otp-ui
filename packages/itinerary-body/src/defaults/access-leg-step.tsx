import { Step } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { defaultMessages } from "../util";

import * as S from "../styled";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  step: Step;
}

/**
 * Renders a step of an access leg.
 */
export default function AccessLegStep({
  className,
  step,
  style
}: Props): ReactElement {
  const { absoluteDirection, relativeDirection, streetName } = step;
  return (
    // Return an HTML element which is passed a className (and style props)
    // for styled-components support.
    <span className={className} style={style}>
      <FormattedMessage
        defaultMessage="{relativeDirection} {absoluteDirection} on {street}"
        description="Describes a step of a set of directions to reach a destination."
        id="otpUi.AccessLegBody.step"
        values={{
          absoluteDirection,
          relativeDirection,
          street: (
            <S.StepStreetName>
              <FormattedMessage
                defaultMessage={
                  defaultMessages["otpUi.AccessLegBody.streetOrUnnamedRoad"]
                }
                description="Displays a street name or unnamed road"
                id="otpUi.AccessLegBody.streetOrUnnamedRoad"
                values={{ streetName }}
              />
            </S.StepStreetName>
          )
        }}
      />
    </span>
  );
}
