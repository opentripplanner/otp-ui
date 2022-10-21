import { Step } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { defaultMessages } from "../util";

import * as S from "../styled";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  step: Step;
}

function getStreetNameContent(streetName: string) {
  switch (streetName) {
    case "road":
      return (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.AccessLegBody.unnamedRoad"]}
          description="Text for an unnamed road"
          id="otpUi.AccessLegBody.unnamedRoad"
        />
      );
    case "path":
      return (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.AccessLegBody.unnamedPath"]}
          description="Text for an unnamed path"
          id="otpUi.AccessLegBody.unnamedPath"
        />
      );
    default:
      return streetName;
  }
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
              {getStreetNameContent(streetName)}
            </S.StepStreetName>
          )
        }}
      />
    </span>
  );
}
