import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { CalendarAlt, Heartbeat, MoneyBillAlt } from "styled-icons/fa-solid";

import {
  DefaultDepart,
  DefaultTransitFare,
  DefaultTNCFare,
  DefaultCaloriesBurned,
  DefaultCaloriesBurnedDescription
} from "./defaults";
import Message from "./message";
import * as Styled from "./styled";
import TripDetail from "./trip-detail";

export default function TripDetails({
  className,
  itinerary,
  localized,
  longDateFormat,
  messages,
  timeOptions
}) {
  messages = coreUtils.messages.mergeMessages(
    TripDetails.defaultProps.messages,
    messages
  );

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
            <Message
              defaultContent={<DefaultTransitFare fareResult={fareResult} />}
              localized={localized}
              messageId={messages.transitFare}
              values={{ transitFare }}
            />
          </Styled.TransitFare>
        )}
        {minTNCFare !== 0 && (
          <Styled.TNCFare>
            <br />
            <Message
              defaultContent={
                <DefaultTNCFare fareResult={fareResult} itinerary={itinerary} />
              }
              localized={localized}
              messageId={messages.tncFare}
              values={{ companies, maxTNCFare, minTNCFare }}
            />
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
  } = coreUtils.itinerary.calculatePhysicalActivity(itinerary);

  return (
    <Styled.TripDetails className={className}>
      <Styled.TripDetailsHeader>
        <Message localized={localized} messageId={messages.title} />
      </Styled.TripDetailsHeader>
      <Styled.TripDetailsBody>
        <TripDetail
          description={
            messages.departDescription && (
              <Message
                localized={localized}
                messageId={messages.departDescription}
              />
            )
          }
          icon={<CalendarAlt size={17} />}
          summary={
            <Styled.Timing>
              <Message
                defaultContent={
                  <DefaultDepart
                    itinerary={itinerary}
                    longDateFormat={longDateFormat}
                    timeOptions={timeOptions}
                  />
                }
                localized={localized}
                messageId={messages.depart}
                values={{ departDate: moment(itinerary.startTime) }}
              />
            </Styled.Timing>
          }
        />
        {fare && (
          <TripDetail
            description={
              messages.transitFareDescription && (
                <Message
                  localized={localized}
                  messageId={messages.transitFareDescription}
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
                <Message
                  defaultContent={
                    <DefaultCaloriesBurned caloriesBurned={caloriesBurned} />
                  }
                  localized={localized}
                  messageId={messages.caloriesBurned}
                  values={{ caloriesBurned }}
                />
              </Styled.CaloriesSummary>
            }
            description={
              messages.caloriesBurnedDescription && (
                <Styled.CaloriesDescription>
                  <Message
                    defaultContent={
                      <DefaultCaloriesBurnedDescription
                        bikeDuration={bikeDuration}
                        walkDuration={walkDuration}
                      />
                    }
                    localized={localized}
                    messageId={messages.caloriesBurnedDescription}
                    values={{ bikeDuration, caloriesBurned, walkDuration }}
                  />
                </Styled.CaloriesDescription>
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
  itinerary: coreUtils.types.itineraryType.isRequired,
  /** Determines whether messages are localized message ids or React content. */
  localized: PropTypes.bool,
  /** the desired format to use for a long date. */
  longDateFormat: PropTypes.string,
  /**
   * messages to use for l10n/i8n
   *
   * Note: messages with default null values included here for visibility.
   * Overriding with truthy content will cause the expandable help
   * message to appear in trip details.
   */
  messages: PropTypes.shape({
    caloriesBurned: PropTypes.element,
    caloriesBurnedDescription: PropTypes.element,
    depart: PropTypes.element,
    departDescription: PropTypes.element,
    title: PropTypes.string,
    tncFare: PropTypes.element,
    transitFare: PropTypes.element,
    transitFareDescription: PropTypes.element
  }),
  /** Contains the preferred format string for time display and a timezone offset. */
  timeOptions: coreUtils.types.timeOptionsType
};

TripDetails.defaultProps = {
  className: null,
  localized: false,
  longDateFormat: null,
  /**
   * If localized is set to true, messages are message ids
   * from an <IntlProvider> component provided by the containing application,
   * otherwise messages are React elements.
   */
  messages: {
    caloriesBurned: null,
    caloriesBurnedDescription: null,
    depart: null,
    departDescription: null,
    title: "Trip Details",
    tncFare: null,
    transitFare: null,
    transitFareDescription: null
  },
  timeOptions: null
};
