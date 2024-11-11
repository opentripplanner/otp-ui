import React, { ReactElement } from "react";
import { Meta } from "@storybook/react";
import { ExclamationTriangle } from "@styled-icons/bootstrap/ExclamationTriangle";
import Alert from "../alert/Alert";
import red from "../colors/red";

const meta: Meta<typeof Alert> = {
  title: "Building-Blocks/Alert",
  component: Alert
};

export default meta;

const alerts = [
  {
    alertUrl: "http://trimet.org/alerts/",
    effectiveStartDate: 1576471800,
    alertDescriptionText:
      "TriMet Customer Service will be unavailable to serve text messages or Twitter responses from 9:00 p.m.- 11:30 p.m. For immediate assistance regarding safety or security concerns, please contact the police via 911."
  },
  {
    alertUrl:
      "https://news.trimet.org/2019/11/next-up-for-elevator-improvements-sunset-transit-center-park-ride/",
    effectiveStartDate: 1573083439,
    alertDescriptionText:
      "The Park and Ride garage elevator at Sunset Transit Center is closed for approximately 3 months for improvements. During this time garage users must use the stairs or find alternate parking. Visit trimet.org/parkandride for a complete list of Park and Ride garages."
  },
  {
    alertUrl: "http://trimet.org/alerts/",
    effectiveStartDate: 1572827580,
    alertDescriptionText:
      "The west elevators at the Washington Park MAX Station are out of service. Please use east elevators to access street level and platforms. "
  }
];

const AlertContent = () => {
  return (
    <>
      {alerts.map((alert, i) => {
        const alertKey = crypto.randomUUID();
        return (
          <>
            <div key={alertKey}>
              {`${i + 1}) `}
              {alert.alertDescriptionText}
            </div>
            <br />
          </>
        );
      })}
    </>
  );
};

export const BasicAlert = (): ReactElement => {
  return (
    <Alert
      alertHeader="Next trip starts on Wednesday April 17th"
      alertSubheader="Trip is due to begin at 7:43 AM (Realtime monitoring will being at 7:13 AM)"
    >
      Here is more content
    </Alert>
  );
};

export const CollapsibleAlertWithTransitAlerts = (): ReactElement => {
  return (
    <Alert
      backgroundColor={red[50]}
      collapsible
      Icon={ExclamationTriangle}
      alertHeader="Your trip has alerts"
    >
      <AlertContent />
    </Alert>
  );
};
