import { differenceInCalendarDays } from "date-fns";
import { toDate, utcToZonedTime } from "date-fns-tz";
import coreUtils from "@opentripplanner/core-utils";
import { Alert } from "@opentripplanner/types";
import React, { FunctionComponent, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

const { getUserTimezone, getCurrentDate } = coreUtils.time;

interface Props {
  alerts: Alert[];
  AlertIcon?: FunctionComponent;
  timeZone?: string;
}

export default function AlertsBody({
  alerts,
  AlertIcon = S.DefaultAlertBodyIcon,
  timeZone = getUserTimezone()
}: Props): ReactElement {
  if (typeof alerts !== "object") return null;
  return (
    <S.TransitAlerts>
      {alerts
        .sort((a, b) => b.effectiveStartDate - a.effectiveStartDate)
        .map(
          (
            {
              alertDescriptionText: description,
              alertHeaderText: header,
              alertUrl,
              effectiveStartDate
            },
            i
          ) => {
            // If alert is effective as of +/- one day, use today, tomorrow, or
            // yesterday with time. Otherwise, use long date format.
            // The difference is expressed in calendar days based on the agency's time zone.
            // Note: Previously, we used moment.diff(..., "days"), which reports the number of whole 24-hour periods
            // between two timestamps/dates (not considering timezones or daylight time changes).
            const today = toDate(getCurrentDate(timeZone));
            const compareDate = utcToZonedTime(
              new Date(effectiveStartDate),
              timeZone
            );
            const dayDiff = differenceInCalendarDays(compareDate, today);

            return (
              <S.TransitAlert key={i} href={alertUrl}>
                <S.TransitAlertIconContainer>
                  <AlertIcon />
                </S.TransitAlertIconContainer>
                {header && (
                  <S.TransitAlertHeader>{header}</S.TransitAlertHeader>
                )}
                <S.TransitAlertBody>{description}</S.TransitAlertBody>
                <S.TransitAlertEffectiveDate>
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages[
                        "otpUi.TransitLegBody.AlertsBody.effectiveDate"
                      ]
                    }
                    description="Text describing when an alert takes effect"
                    id="otpUi.TransitLegBody.AlertsBody.effectiveDate"
                    values={{
                      dateTime: effectiveStartDate,
                      dayDiff,
                      includeTime: Math.abs(dayDiff) <= 1
                    }}
                  />
                </S.TransitAlertEffectiveDate>
              </S.TransitAlert>
            );
          }
        )}
    </S.TransitAlerts>
  );
}
