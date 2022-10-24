import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

enum Action {
  circleClockwise = "CIRCLE_CLOCKWISE",
  circleCounterClockwise = "CIRCLE_COUNTERCLOCKWISE",
  continue = "CONTINUE",
  hardLeft = "HARD_LEFT",
  hardRight = "HARD_RIGHT",
  left = "LEFT",
  right = "RIGHT",
  slightlyLeft = "SLIGHTLY_LEFT",
  slightlyRight = "SLIGHTLY_RIGHT",
  uTurnLeft = "UTURN_LEFT",
  uTurnRight = "UTURN_RIGHT"
}

interface Props {
  action: Action;
}

/**
 * Helper component that display localized strings for the given action string.
 */
export default function AccessLegStepAction({ action }: Props): ReactElement {
  // Note that we don't make use of dynamic message ids,
  // so that formatjs CLI tools can pick the strings up for analysis.
  switch (action) {
    case Action.circleClockwise:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action circle clockwise"
          id="otpUi.AccessLegBody.step.circleClockwise"
        />
      );
    case Action.circleCounterClockwise:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action circle counter-clockwise"
          id="otpUi.AccessLegBody.step.circleCounterClockwise"
        />
      );
    case Action.continue:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action continue"
          id="otpUi.AccessLegBody.step.continue"
        />
      );
    case Action.hardLeft:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action hard left"
          id="otpUi.AccessLegBody.step.hardLeft"
        />
      );
    case Action.hardRight:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action hard right"
          id="otpUi.AccessLegBody.step.hardRight"
        />
      );
    case Action.left:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action left"
          id="otpUi.AccessLegBody.step.left"
        />
      );
    case Action.right:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action right"
          id="otpUi.AccessLegBody.step.right"
        />
      );
    case Action.slightlyLeft:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action slightly left"
          id="otpUi.AccessLegBody.step.slightlyLeft"
        />
      );
    case Action.slightlyRight:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action slightly right"
          id="otpUi.AccessLegBody.step.slightlyRight"
        />
      );
    case Action.uTurnLeft:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action u-turn left"
          id="otpUi.AccessLegBody.step.uTurnLeft"
        />
      );
    case Action.uTurnRight:
      return (
        <FormattedMessage
          defaultMessage={action}
          description="Step action u-turn right"
          id="otpUi.AccessLegBody.step.uTurnRight"
        />
      );
    default:
      throw new Error(`Invalid step action: ${action}`);
  }
}
