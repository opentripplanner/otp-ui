// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import { Config, Leg } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import * as Styled from "../styled";
import { LegIconComponent } from "../types";

interface Props {
  config: Config;
  leg: Leg;
  LegIcon: LegIconComponent;
  onSummaryClick: () => void;
  showLegIcon: boolean;
}

export default function AccessLegSummary({
  config,
  leg,
  LegIcon,
  onSummaryClick,
  showLegIcon
}: Props): ReactElement {
  const intl = useIntl();
  return (
    <Styled.LegClickable onClick={onSummaryClick}>
      {showLegIcon && (
        <Styled.LegIconContainer>
          <LegIcon leg={leg} />
        </Styled.LegIconContainer>
      )}

      {/* Leg description, e.g. "Walk 0.5 mi to..." */}
      <Styled.LegDescription>
        <FormattedMessage
          defaultMessage="{modeId} {distance} to {place}"
          description="Summarizes an access leg"
          id="otpUi.AccessLegBody.summary"
          values={{
            // TODO: Implement metric vs imperial (up until now it's just imperial).
            distance:
              leg.distance > 0
                ? humanizeDistanceString(leg.distance, false, intl)
                : 0,
            isCarHail: leg.hailedCar,
            modeId: leg.mode,
            // FIXME: localize rental device names.
            place: coreUtils.itinerary.getPlaceName(leg.to, config.companies)
          }}
        />
      </Styled.LegDescription>
    </Styled.LegClickable>
  );
}
