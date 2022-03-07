import moment from "moment";
import { Alert } from "@opentripplanner/types";
import React, { FunctionComponent, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";

interface Props {
  alerts: Alert[];
  AlertIcon?: FunctionComponent;
}

export default function AlertsBody({
  alerts,
  AlertIcon = S.DefaultAlertBodyIcon
}: Props): ReactElement {
  return (
    <S.TransitAlerts>
      {alerts
        .sort((a, b) => b.effectiveStartDate - a.effectiveStartDate)
        .map((alert, i) => {
          // If alert is effective as of +/- one day, use today, tomorrow, or
          // yesterday with time. Otherwise, use long date format.
          // FIXME: adding 24 hours to a date that is "today" can lead moment to
          // report the result to still be "today" (see OTP-RR story).
          const dayDiff = moment(alert.effectiveStartDate).diff(
            moment(),
            "days"
          );
          return (
            <S.TransitAlert key={i} href={alert.alertUrl}>
              <S.TransitAlertIconContainer>
                <AlertIcon />
              </S.TransitAlertIconContainer>
              {alert.alertHeaderText ? (
                <S.TransitAlertHeader>
                  {alert.alertHeaderText}
                </S.TransitAlertHeader>
              ) : null}
              <S.TransitAlertBody>
                {alert.alertDescriptionText}
              </S.TransitAlertBody>
              <S.TransitAlertEffectiveDate>
                <FormattedMessage
                  defaultMessage={"{dateTime, date, long}"}
                  description="Text describing when an alert takes effect"
                  id="otpUi.TransitLegBody.AlertsBody.effectiveDate"
                  values={{
                    dateTime: alert.effectiveStartDate,
                    dayDiff,
                    includeTime: Math.abs(dayDiff) <= 1
                  }}
                />
              </S.TransitAlertEffectiveDate>
            </S.TransitAlert>
          );
        })}
    </S.TransitAlerts>
  );
}
