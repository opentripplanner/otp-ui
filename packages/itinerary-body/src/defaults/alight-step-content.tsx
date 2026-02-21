import React, { ReactElement } from "react";
import { FormattedMessage, FormattedTime } from "react-intl";

import * as S from "../styled";
import { AlightStepContentProps } from "../types";
import { defaultMessages } from "../util";

/**
 * This is the default component for displaying the alighting step
 * in the ItineraryBody -> PlaceRow component.
 */
export default function AlightStepContent({
  leg
}: AlightStepContentProps): ReactElement {
  return (
    <S.AlightingStep>
      <FormattedTime value={leg.endTime} />{" "}
      <FormattedMessage
        id="otpUi.ItineraryBody.alightAt"
        defaultMessage={defaultMessages["otpUi.ItineraryBody.alightAt"]}
        description="Instructions to alight at a stop"
        values={{ stopName: leg.to.name }}
      />
    </S.AlightingStep>
  );
}
