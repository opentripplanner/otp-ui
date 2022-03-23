import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import { Config, Leg } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import * as S from "../styled";
import { LegIconComponent } from "../types";
import { getPlaceName } from "../util";

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
    <S.LegClickable onClick={onSummaryClick}>
      {showLegIcon && (
        <S.LegIconContainer>
          <LegIcon leg={leg} />
        </S.LegIconContainer>
      )}

      {/* Leg description, e.g. "Walk 0.5 mi to..." */}
      <S.LegDescription>
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
            place: getPlaceName(leg.to, config.companies, intl)
          }}
        />
      </S.LegDescription>
    </S.LegClickable>
  );
}
