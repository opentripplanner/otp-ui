/* eslint-disable no-case-declarations */
import { Step, UnitSystem } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

import AccessLegStepAction, { Action } from "./access-leg-step-action";
import AccessLegStepHeading, { Heading } from "./access-leg-step-heading";
import Distance from "./default-distance";
import StreetName from "./street-name";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  step: Step;
  units?: UnitSystem;
}

/**
 * Renders a step of an access leg.
 */
export default function AccessLegStep({
  className,
  step,
  style,
  units
}: Props): ReactElement {
  const { absoluteDirection, distance, relativeDirection, streetName } = step;

  const street = (
    <S.StepStreetName>
      <StreetName rawStreetName={streetName} />
    </S.StepStreetName>
  );

  let stepContent;
  const action = relativeDirection as Action;
  switch (relativeDirection) {
    case "ELEVATOR":
      stepContent = (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.AccessLegBody.stepElevator"]}
          description="Text for taking an elevator"
          id="otpUi.AccessLegBody.stepElevator"
          values={{ street }}
        />
      );
      break;
    case "DEPART":
      const heading = absoluteDirection as Heading;
      stepContent = (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.AccessLegBody.stepDepart"]}
          description="Describes the initial action to take for an itinerary"
          id="otpUi.AccessLegBody.stepDepart"
          values={{
            heading: <AccessLegStepHeading heading={heading} />,
            street
          }}
        />
      );
      break;
    case "ENTER_STATION":
    case "EXIT_STATION":
      stepContent = (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.AccessLegBody.stepStation"]}
          description="Describes an action to progress through an itinerary"
          id="otpUi.AccessLegBody.stepStation"
          values={{
            step: <AccessLegStepAction action={action} />,
            street
          }}
        />
      );
      break;
    case "FOLLOW_SIGNS":
      stepContent = (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.AccessLegBody.stepFollowSigns"]
          }
          description="Describes an action to progress through an itinerary"
          id="otpUi.AccessLegBody.stepFollowSigns"
          values={{
            street
          }}
        />
      );
      break;
    default:
      stepContent = (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.AccessLegBody.stepGeneric"]}
          description="Describes an action to progress through an itinerary"
          id="otpUi.AccessLegBody.stepGeneric"
          values={{
            step: <AccessLegStepAction action={action} />,
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
      {distance > 0 && (
        <S.StepLength>
          <Distance meters={distance} units={units} />
        </S.StepLength>
      )}
    </span>
  );
}
