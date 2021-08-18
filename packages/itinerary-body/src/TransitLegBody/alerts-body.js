import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "../styled";

export default function AlertsBody({
  alerts,
  longDateFormat,
  timeFormat,
  AlertIcon
}) {
  return (
    <Styled.TransitAlerts>
      {alerts
        .sort((a, b) => b.effectiveStartDate - a.effectiveStartDate)
        .map((alert, i) => {
          // If alert is effective as of +/- one day, use today, tomorrow, or
          // yesterday with time. Otherwise, use long date format.
          const dateTimeString = moment(alert.effectiveStartDate).calendar(
            null,
            {
              sameDay: `${timeFormat}, [Today]`,
              nextDay: `${timeFormat}, [Tomorrow]`,
              lastDay: `${timeFormat}, [Yesterday]`,
              lastWeek: `${longDateFormat}`,
              sameElse: `${longDateFormat}`
            }
          );
          const effectiveDateString = `Effective as of ${dateTimeString}`;
          return (
            <Styled.TransitAlert key={i} href={alert.alertUrl}>
              <Styled.TransitAlertIconContainer>
                <AlertIcon />
              </Styled.TransitAlertIconContainer>
              {alert.alertHeaderText ? (
                <Styled.TransitAlertHeader>
                  {alert.alertHeaderText}
                </Styled.TransitAlertHeader>
              ) : null}
              <Styled.TransitAlertBody>
                {alert.alertDescriptionText}
              </Styled.TransitAlertBody>
              <Styled.TransitAlertEffectiveDate>
                {effectiveDateString}
              </Styled.TransitAlertEffectiveDate>
            </Styled.TransitAlert>
          );
        })}
    </Styled.TransitAlerts>
  );
}

AlertsBody.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  longDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  AlertIcon: PropTypes.elementType
};

AlertsBody.defaultProps = {
  AlertIcon: Styled.DefaultAlertBodyIcon
};
