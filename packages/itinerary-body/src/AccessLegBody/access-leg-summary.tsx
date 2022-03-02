import coreUtils from "@opentripplanner/core-utils";
import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import { Config, Leg } from "@opentripplanner/types";
import React, { FunctionComponent, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as Styled from "../styled";

interface Props {
  config: Config;
  leg: Leg;
  LegIcon: FunctionComponent<{ leg: Leg }>;
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
          defaultMessage="{mode} {distance} to {place}"
          description="Summarizes an access leg"
          id="otpUi.AccessLegBody.summary"
          values={{
            // TODO: Implement metric vs imperial (right now it's just imperial).
            distance:
              leg.distance > 0 ? humanizeDistanceString(leg.distance) : 0,
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
