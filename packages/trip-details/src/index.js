/* eslint-disable react/prop-types */
import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage } from "react-intl";
import { CalendarAlt, Heartbeat, MoneyBillAlt } from "styled-icons/fa-solid";

import * as Styled from "./styled";
import TripDetail from "./trip-detail";

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

const minutePlural = "plural, one {minute} other {minutes}";

const defaultCaloriesDescription = `Calories burned is based on
  <b>{walkMinutes} {walkMinutes, ${minutePlural}}</b> spent walking and
  <b>{bikeMinutes} {bikeMinutes, ${minutePlural}}</b> spent biking during this trip.
  Adapted from <a>Dietary Guidelines for Americans 2005, page 16, Table 4</a>.`;

/**
 * Default rendering if no component is provided for CaloriesDescription
 * in the TripDetails component.
 */
function DefaultCaloriesDescription({ bikeSeconds, calories, walkSeconds }) {
  return (
    <FormattedMessage
      defaultMessage={defaultCaloriesDescription}
      id="otpUi.TripDetails.caloriesDescription"
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
  CaloriesDescription = DefaultCaloriesDescription,
  className,
  DepartDescription,
  FareDescription,
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
              defaultMessage="Transit Fare: <b>{transitFare, number, ::.00 currency/USD}</b>"
              id="otpUi.TripDetails.transitFare"
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
              defaultMessage="{companies} Fare: <b>{minTNCFare, number, ::.00 currency/USD} - {maxTNCFare, number, ::.00 currency/USD}</b>"
              id="otpUi.TripDetails.tncFare"
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
          defaultMessage="Trip Details"
          id="otpUi.TripDetails.title"
        />
      </Styled.TripDetailsHeader>
      <Styled.TripDetailsBody>
        <TripDetail
          // Any custom description for the Departure message needs to be handled by the slot.
          description={
            DepartDescription && (
              <DepartDescription departureDate={departureDate} />
            )
          }
          icon={<CalendarAlt size={17} />}
          summary={
            <Styled.Timing>
              <FormattedMessage
                defaultMessage="Depart <b>{departureDate, date, ::yyyyMMMMdd}</b> at <b>{departureDate, time, ::h:mm}</b>"
                id="otpUi.TripDetails.depart"
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
              FareDescription && (
                <FareDescription
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
                  defaultMessage="Calories Burned: <b>{calories, number, ::.}</b>"
                  id="otpUi.TripDetails.calories"
                  values={{
                    b: BoldText,
                    calories: caloriesBurned
                  }}
                />
              </Styled.CaloriesSummary>
            }
            description={
              CaloriesDescription && (
                <CaloriesDescription
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
