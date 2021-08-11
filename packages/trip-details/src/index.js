/* eslint-disable react/prop-types */
import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage } from "react-intl";
import { CalendarAlt, Heartbeat, MoneyBillAlt } from "styled-icons/fa-solid";

import * as Styled from "./styled";
import TripDetail from "./trip-detail";

// Load the default messages.
import defaultMessages from "../i18n/en-US.yml";

const MESSAGE_ID_PREFIX = "otpUi.TripDetails.";
const messageIds = {
  calories: `${MESSAGE_ID_PREFIX}calories`,
  caloriesDescription: `${MESSAGE_ID_PREFIX}caloriesDescription`,
  departure: `${MESSAGE_ID_PREFIX}departure`,
  title: `${MESSAGE_ID_PREFIX}title`,
  tncFare: `${MESSAGE_ID_PREFIX}tncFare`,
  transitFare: `${MESSAGE_ID_PREFIX}transitFare`
};

// TODOS:
// - diet url
// - currency
// - date/time format

/**
 * Format text bold (used with FormattedMessage).
 */
// TODO: Find a better place for this component.
function BoldText(contents) {
  return <b>{contents}</b>;
}

/**
 * Default rendering if no component is provided for CaloriesDescription
 * in the TripDetails component.
 */
function DefaultCaloriesDetails({ bikeSeconds, calories, walkSeconds }) {
  return (
    <FormattedMessage
      defaultMessage={defaultMessages[messageIds.caloriesDescription]}
      id={messageIds.caloriesDescription}
      values={{
        // eslint-disable-next-line react/display-name
        a: contents => (
          <a
            href="https://health.gov/dietaryguidelines/dga2005/document/html/chapter3.htm#table4"
            rel="noopener noreferrer"
            target="_blank"
          >
            {contents}
          </a>
        ),
        b: BoldText,
        bikeMinutes: Math.round(bikeSeconds / 60),
        calories: Math.round(calories),
        walkMinutes: Math.round(walkSeconds / 60)
      }}
    />
  );
}

/**
 * Renders trip details such as departure instructions, fare amount, and calories spent.
 */
export default function TripDetails({
  CaloriesDetails = DefaultCaloriesDetails,
  className,
  DepartureDetails,
  FareDetails,
  itinerary
}) {
  // TODO: refactor
  let companies;
  itinerary.legs.forEach(leg => {
    if (leg.tncData) {
      companies = leg.tncData.company;
    }
  });

  // process the transit fare
  const fareResult = coreUtils.itinerary.calculateFares(itinerary);
  const { maxTNCFare, minTNCFare, transitFare } = fareResult;
  let fare;
  if (transitFare || minTNCFare) {
    fare = (
      <Styled.Fare>
        {transitFare && (
          <Styled.TransitFare>
            <FormattedMessage
              defaultMessage={defaultMessages[messageIds.transitFare]}
              id={messageIds.transitFare}
              values={{
                b: BoldText,
                transitFare: transitFare / 100
              }}
            />
          </Styled.TransitFare>
        )}
        {minTNCFare !== 0 && (
          <Styled.TNCFare>
            <br />
            <FormattedMessage
              defaultMessage={defaultMessages[messageIds.tncFare]}
              id={messageIds.tncFare}
              values={{
                b: BoldText,
                companies: (
                  <Styled.TNCFareCompanies>
                    {companies.toLowerCase()}
                  </Styled.TNCFareCompanies>
                ),
                maxTNCFare,
                minTNCFare
              }}
            />
          </Styled.TNCFare>
        )}
      </Styled.Fare>
    );
  }

  const departureDate = moment(itinerary.startTime);

  // Compute calories burned.
  const {
    bikeDuration,
    caloriesBurned,
    walkDuration
  } = coreUtils.itinerary.calculatePhysicalActivity(itinerary);

  return (
    <Styled.TripDetails className={className}>
      <Styled.TripDetailsHeader>
        <FormattedMessage
          defaultMessage={defaultMessages[messageIds.title]}
          id={messageIds.title}
        />
      </Styled.TripDetailsHeader>
      <Styled.TripDetailsBody>
        <TripDetail
          // Any custom description for the Departure message needs to be handled by the slot.
          description={
            DepartureDetails && (
              <DepartureDetails departureDate={departureDate} />
            )
          }
          icon={<CalendarAlt size={17} />}
          summary={
            <Styled.Timing>
              <FormattedMessage
                defaultMessage={defaultMessages[messageIds.departure]}
                id={messageIds.departure}
                values={{
                  b: BoldText,
                  departureDate
                }}
              />
            </Styled.Timing>
          }
        />
        {fare && (
          <TripDetail
            // Any custom description for the transit fare needs to be handled by the slot.
            description={
              FareDetails && (
                <FareDetails
                  maxTNCFare={maxTNCFare}
                  minTNCFare={minTNCFare}
                  transitFare={transitFare}
                />
              )
            }
            icon={<MoneyBillAlt size={17} />}
            summary={fare}
          />
        )}
        {caloriesBurned > 0 && (
          <TripDetail
            icon={<Heartbeat size={17} />}
            summary={
              <Styled.CaloriesSummary>
                <FormattedMessage
                  defaultMessage={defaultMessages[messageIds.calories]}
                  id={messageIds.calories}
                  values={{
                    b: BoldText,
                    calories: caloriesBurned
                  }}
                />
              </Styled.CaloriesSummary>
            }
            description={
              CaloriesDetails && (
                <CaloriesDetails
                  bikeSeconds={bikeDuration}
                  calories={caloriesBurned}
                  walkSeconds={walkDuration}
                />
              )
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
  /** Itinerary that the user has selected to view, contains multiple legs. */
  itinerary: coreUtils.types.itineraryType.isRequired
};

TripDetails.defaultProps = {
  className: null
};
