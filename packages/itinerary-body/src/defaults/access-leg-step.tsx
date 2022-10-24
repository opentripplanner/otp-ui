import { Step } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { defaultMessages } from "../util";

import * as S from "../styled";
import AccessLegStepAction from "./access-leg-step-action";
import CompassDirection from "./compass-direction";
import StreetName from "./street-name";

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
  const street = (
    <S.StepStreetName>
      <StreetName rawStreetName={streetName} />
    </S.StepStreetName>
  );

  let stepContent;
  if (relativeDirection === "ELEVATOR") {
    stepContent = (
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.AccessLegBody.stepElevator"]}
        description="Text for taking an elevator"
        id="otpUi.AccessLegBody.stepElevator"
        values={{ street }}
      />
    );
  } else if (relativeDirection === "DEPART") {
    stepContent = (
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.AccessLegBody.stepDepart"]}
        description="Describes the initial action to take for an itinerary"
        id="otpUi.AccessLegBody.stepDepart"
        values={{
          compassDirection: <CompassDirection direction={absoluteDirection} />,
          street
        }}
      />
    );
  } else {
    stepContent = (
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.AccessLegBody.stepGeneric"]}
        description="Describes an action to progress through an itinerary"
        id="otpUi.AccessLegBody.stepGeneric"
        values={{
          step: <AccessLegStepAction action={relativeDirection} />,
          street
        }}
      />
    );
  }

  return (
    // Return an HTML element which is passed a className (and style props)
    // for styled-components support.
    <span className={className} style={style}>
      {stepContent}
    </span>
  );
}
