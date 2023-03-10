import coreUtils from "@opentripplanner/core-utils";
import { ClassicLegIcon } from "@opentripplanner/icons";
import { Leg } from "@opentripplanner/types";
import React, { ReactElement } from "react";

interface Props {
  leg: Leg;
  // plus other props not listed here.
}

/**
 * For illustration only. Component where the transit leg icons have an (untranslated) aria-label.
 */
const LegIconWithA11y = (props: Props): ReactElement => {
  const { leg } = props;
  const { mode } = leg;
  const ariaLabel = coreUtils.itinerary.isTransit(mode) ? mode : undefined;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ClassicLegIcon {...props} aria-label={ariaLabel} />;
};

export default LegIconWithA11y;
