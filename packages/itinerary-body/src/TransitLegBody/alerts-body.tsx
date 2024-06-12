import { differenceInCalendarDays } from "date-fns";
import { toDate, utcToZonedTime } from "date-fns-tz";
import coreUtils from "@opentripplanner/core-utils";
import { Alert } from "@opentripplanner/types";
import React, { FunctionComponent, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import { ExternalLinkAlt } from "@styled-icons/fa-solid";
import * as S from "../styled";
import { defaultMessages } from "../util";

const { getUserTimezone, getCurrentDate } = coreUtils.time;

interface Props {
  agencyName?: string;
  alerts: Alert[];
  AlertIcon?: FunctionComponent;
  timeZone?: string;
}

interface AlertDayProps {
  dayDiff: number;
}

/**
 * Displays today/yesterday/tomorrow in the correct language.
 */
function AlertDay({ dayDiff }: AlertDayProps) {
  switch (dayDiff) {
    case -1:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TransitLegBody.AlertsBody.yesterday"]
          }
          description="Yesterday"
          id="otpUi.TransitLegBody.AlertsBody.yesterday"
        />
      );
    case 0:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TransitLegBody.AlertsBody.today"]
          }
          description="Today"
          id="otpUi.TransitLegBody.AlertsBody.today"
        />
      );
    case 1:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TransitLegBody.AlertsBody.tomorrow"]
          }
          description="Tomorrow"
          id="otpUi.TransitLegBody.AlertsBody.tomorrow"
        />
      );
    default:
      // Not used.
      return null;
  }
}

export default function AlertsBody({
  agencyName,
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
              <S.TransitAlert key={i}>
                <S.TransitAlertIconContainer>
                  <AlertIcon />
                </S.TransitAlertIconContainer>
                {header && (
                  <S.TransitAlertHeader>{header}</S.TransitAlertHeader>
                )}
                <S.TransitAlertBody>{description}</S.TransitAlertBody>
                <S.TransitAlertEffectiveDate>
                  {Math.abs(dayDiff) <= 1 ? (
                    <FormattedMessage
                      defaultMessage={
                        defaultMessages[
                          "otpUi.TransitLegBody.AlertsBody.effectiveTimeAndDate"
                        ]
                      }
                      description="Text with the time and date an alert takes effect"
                      id="otpUi.TransitLegBody.AlertsBody.effectiveTimeAndDate"
                      values={{
                        dateTime: effectiveStartDate * 1000,
                        day: <AlertDay dayDiff={dayDiff} />
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      defaultMessage={
                        defaultMessages[
                          "otpUi.TransitLegBody.AlertsBody.effectiveDate"
                        ]
                      }
                      description="Text with the date an alert takes effect"
                      id="otpUi.TransitLegBody.AlertsBody.effectiveDate"
                      values={{
                        dateTime: effectiveStartDate * 1000
                      }}
                    />
                  )}
                  {alertUrl?.trim() && (
                    <S.TransitAlertExternalLink href={alertUrl} target="_blank">
                      <ExternalLinkAlt height={10} />
                      {agencyName ? (
                        <FormattedMessage
                          defaultMessage={
                            defaultMessages[
                              "otpUi.TransitLegBody.AlertsBody.alertLinkText"
                            ]
                          }
                          description="Describes how link directs to agency website"
                          id="otpUi.TransitLegBody.AlertsBody.alertLinkText"
                          values={{ agency: agencyName }}
                        />
                      ) : (
                        <FormattedMessage
                          defaultMessage={
                            defaultMessages[
                              "otpUi.TransitLegBody.AlertsBody.noAgencyAlertLinkText"
                            ]
                          }
                          description="Describes how link directs to agency website, but does not name agency"
                          id="otpUi.TransitLegBody.AlertsBody.noAgencyAlertLinkText"
                        />
                      )}

                      <S.InvisibleAdditionalDetails>
                        {" "}
                        <FormattedMessage id="otpUi.TransitLegBody.AlertsBody.linkOpensNewWindow" />
                      </S.InvisibleAdditionalDetails>
                    </S.TransitAlertExternalLink>
                  )}
                </S.TransitAlertEffectiveDate>
              </S.TransitAlert>
            );
          }
        )}
    </S.TransitAlerts>
  );
}
