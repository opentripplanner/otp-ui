/* eslint-disable no-case-declarations */
import { Step } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import { defaultMessages } from "../util";

import * as S from "../styled";
import AccessLegStepAction, { Action } from "./access-leg-step-action";
import AccessLegStepHeading, { Heading } from "./access-leg-step-heading";
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
  const intl = useIntl();

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
      {/* TODO: Implement metric vs imperial (up until now it's just imperial). */}
      {step?.distance > 0 && (
        <S.StepLength>
          {humanizeDistanceString(step.distance, false, intl)}
        </S.StepLength>
      )}
    </span>
  );
}
