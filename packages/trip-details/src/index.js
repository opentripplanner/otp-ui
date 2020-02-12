import {
  calculateFares,
  calculatePhysicalActivity
} from "@opentripplanner/core-utils/lib/itinerary";
import { formatTime } from "@opentripplanner/core-utils/lib/time";
import {
  itineraryType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  CalendarAlt,
  Heartbeat,
  MoneyBillAlt,
  QuestionCircle,
  TimesCircle
} from "styled-icons/fa-solid";
import { VelocityTransitionGroup } from "velocity-react";

import * as Styled from "./styled";

export default function TripDetails({
  className,
  itinerary,
  longDateFormat,
  routingType,
  timeOptions
}) {
  const date = moment(itinerary.startTime);

  // process the transit fare
  const {
    centsToString,
    dollarsToString,
    maxTNCFare,
    minTNCFare,
    transitFare
  } = calculateFares(itinerary);
  let companies;
  itinerary.legs.forEach(leg => {
    if (leg.tncData) {
      companies = leg.tncData.company;
    }
  });
  let fare;
  if (transitFare || minTNCFare) {
    fare = (
      <Styled.Fare>
        {transitFare && (
          <Styled.TransitFare>
            Transit Fare: <b>{centsToString(transitFare)}</b>
          </Styled.TransitFare>
        )}
        {minTNCFare !== 0 && (
          <Styled.TNCFare>
            <br />
            <Styled.TNCFareCompanies>
              {companies.toLowerCase()}
            </Styled.TNCFareCompanies>{" "}
            Fare:{" "}
            <b>
              {dollarsToString(minTNCFare)} - {dollarsToString(maxTNCFare)}
            </b>
          </Styled.TNCFare>
        )}
      </Styled.Fare>
    );
  }

  // Compute calories burned.
  const {
    bikeDuration,
    caloriesBurned,
    walkDuration
  } = calculatePhysicalActivity(itinerary);

  return (
    <Styled.TripDetails className={className}>
      <Styled.TripDetailsHeader>Trip Details</Styled.TripDetailsHeader>
      <Styled.TripDetailsBody>
        <TripDetail
          icon={<CalendarAlt size={17} />}
          summary={
            <Styled.Timing>
              <span>
                Depart <b>{date.format(longDateFormat)}</b>
              </span>
              {routingType === "ITINERARY" && (
                <span>
                  {" "}
                  at <b>{formatTime(itinerary.startTime, timeOptions)}</b>
                </span>
              )}
            </Styled.Timing>
          }
        />
        {fare && (
          <TripDetail icon={<MoneyBillAlt size={17} />} summary={fare} />
        )}
        {caloriesBurned > 0 && (
          <TripDetail
            icon={<Heartbeat size={17} />}
            summary={
              <Styled.CaloriesSummary>
                Calories Burned: <b>{Math.round(caloriesBurned)}</b>
              </Styled.CaloriesSummary>
            }
            description={
              <Styled.CaloriesDescription>
                Calories burned is based on{" "}
                <b>{Math.round(walkDuration / 60)} minute(s)</b> spent walking
                and <b>{Math.round(bikeDuration / 60)} minute(s)</b> spent
                biking during this trip. Adapted from{" "}
                <a
                  href="https://health.gov/dietaryguidelines/dga2005/document/html/chapter3.htm#table4"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Dietary Guidelines for Americans 2005, page 16, Table 4
                </a>
                .
              </Styled.CaloriesDescription>
            }
          />
        )}
      </Styled.TripDetailsBody>
    </Styled.TripDetails>
  );
}

TripDetails.propTypes = {
  /** Used for additional styling with styled components for example. */
  className: PropTypes.string,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: itineraryType.isRequired,
  /** the desired format to use for a long date */
  longDateFormat: PropTypes.string,
  /** whether the routing type is an itinerary or a profile result */
  routingType: PropTypes.string,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: timeOptionsType
};

TripDetails.defaultProps = {
  className: null,
  longDateFormat: null,
  routingType: "ITINERARY",
  timeOptions: null
};

class TripDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggle = () => {
    const { expanded } = this.state;
    if (expanded) this.onHideClick();
    else this.onExpandClick();
  };

  onExpandClick = () => {
    this.setState({ expanded: true });
  };

  onHideClick = () => {
    this.setState({ expanded: false });
  };

  render() {
    const { icon, summary, description } = this.props;
    const { expanded } = this.state;
    return (
      <Styled.TripDetail>
        <Styled.TripDetailIcon>{icon}</Styled.TripDetailIcon>
        <Styled.TripDetailSummary>
          {summary}
          {description && (
            <Styled.ExpandButton onClick={this.toggle}>
              <QuestionCircle size={17} />
            </Styled.ExpandButton>
          )}
          <VelocityTransitionGroup
            enter={{ animation: "slideDown" }}
            leave={{ animation: "slideUp" }}
          >
            {expanded && (
              <Styled.TripDetailDescription>
                <Styled.HideButton onClick={this.onHideClick}>
                  <TimesCircle size={17} />
                </Styled.HideButton>
                {description}
              </Styled.TripDetailDescription>
            )}
          </VelocityTransitionGroup>
        </Styled.TripDetailSummary>
      </Styled.TripDetail>
    );
  }
}

TripDetail.propTypes = {
  icon: PropTypes.node.isRequired,
  summary: PropTypes.node.isRequired,
  description: PropTypes.node
};

TripDetail.defaultProps = {
  description: undefined
};
