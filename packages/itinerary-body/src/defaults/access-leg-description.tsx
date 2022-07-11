import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import { Config, Leg } from "@opentripplanner/types";
import React, { HTMLAttributes, ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as S from "../styled";

import { getPlaceName } from "../util";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  config: Config;
  leg: Leg;
}

/**
 * Renders leg description text, e.g. "Walk 0.5 mi to..."
 * while letting others style the mode and place text.
 */
export default function AccessLegDescription({
  className,
  config,
  leg,
  style
}: Props): ReactElement {
  const intl = useIntl();
  // Replace the Vertex Type for BIKESHARE with VEHICLE as we do not know that
  // it is a bike yet because that information is in the next leg with OTP2.
  const toPlace = {
    ...leg.to,
    vertexType:
      leg.to.vertexType === "BIKESHARE" ? "VEHICLE" : leg.to.vertexType
  };
  return (
    // Return an HTML element which is passed a className (and style props)
    // for styled-components support.
    <span className={className} style={style}>
      <FormattedMessage
        defaultMessage="{mode} {distance} to {place}"
        description="Summarizes an access leg"
        id="otpUi.AccessLegBody.summary"
        values={{
          // TODO: Implement metric vs imperial (up until now it's just imperial).
          distance:
            leg.distance > 0
              ? humanizeDistanceString(leg.distance, false, intl)
              : 0,
          mode: (
            <S.LegDescriptionMode>
              <FormattedMessage
                defaultMessage="{modeId}"
                description="The mode action for an access leg"
                id="otpUi.AccessLegBody.summaryMode"
                values={{
                  isCarHail: leg.hailedCar,
                  modeId: leg.mode
                }}
              />
            </S.LegDescriptionMode>
          ),
          place: (
            <S.LegDescriptionPlace>
              {getPlaceName(toPlace, config.companies, intl)}
            </S.LegDescriptionPlace>
          )
        }}
      />
    </span>
  );
}
