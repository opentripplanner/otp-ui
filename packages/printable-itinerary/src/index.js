import {
  getLegModeLabel,
  getPlaceName,
  getStepDirection,
  getStepStreetName
} from "@opentripplanner/core-utils/lib/itinerary";
import {
  formatTime,
  formatDuration
} from "@opentripplanner/core-utils/lib/time";
import {
  configType,
  itineraryType,
  legType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "./styled";

export default function PrintableItinerary({
  className,
  config,
  itinerary,
  LegIcon,
  timeOptions
}) {
  return (
    <Styled.PrintableItinerary className={className}>
      {itinerary.legs.length > 0 && (
        <Styled.CollapsedTop>
          <Styled.LegBody>
            <Styled.LegHeader>
              <b>Depart</b> from <b>{itinerary.legs[0].from.name}</b>
            </Styled.LegHeader>
          </Styled.LegBody>
        </Styled.CollapsedTop>
      )}
      {itinerary.legs.map((leg, k) =>
        leg.transitLeg ? (
          <TransitLeg
            interlineFollows={
              k < itinerary.legs.length - 1 &&
              itinerary.legs[k + 1].interlineWithPreviousLeg
            }
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            timeOptions={timeOptions}
          />
        ) : leg.hailedCar ? (
          <TNCLeg leg={leg} LegIcon={LegIcon} timeOptions={timeOptions} />
        ) : (
          <AccessLeg
            config={config}
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            timeOptions={timeOptions}
          />
        )
      )}
    </Styled.PrintableItinerary>
  );
}

PrintableItinerary.propTypes = {
  /** Used for additional styling with styled components for example. */
  className: PropTypes.string,
  /** Contains OTP configuration details. */
  config: configType.isRequired,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: itineraryType.isRequired,
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: PropTypes.elementType.isRequired,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: timeOptionsType
};

PrintableItinerary.defaultProps = {
  className: null,
  timeOptions: null
};

function TransitLeg({ leg, LegIcon, interlineFollows, timeOptions }) {
  // Handle case of transit leg interlined w/ previous
  if (leg.interlineWithPreviousLeg) {
    return (
      <Styled.CollapsedTop>
        <Styled.LegBody>
          <Styled.LegHeader>
            Continues as{" "}
            <b>
              {leg.routeShortName} {leg.routeLongName}
            </b>{" "}
            to <b>{leg.to.name}</b>
          </Styled.LegHeader>
          <Styled.LegDetails>
            <Styled.LegDetail>
              Get off at <b>{leg.to.name}</b> at{" "}
              {formatTime(leg.endTime, timeOptions)}
            </Styled.LegDetail>
          </Styled.LegDetails>
        </Styled.LegBody>
      </Styled.CollapsedTop>
    );
  }

  return (
    <Styled.Leg>
      <Styled.ModeIcon>
        <LegIcon leg={leg} />
      </Styled.ModeIcon>
      <Styled.LegBody>
        <Styled.LegHeader>
          <b>
            {leg.routeShortName} {leg.routeLongName}
          </b>{" "}
          to <b>{leg.to.name}</b>
        </Styled.LegHeader>
        <Styled.LegDetails>
          <Styled.LegDetail>
            Board at <b>{leg.from.name}</b> at{" "}
            {formatTime(leg.startTime, timeOptions)}
          </Styled.LegDetail>
          <Styled.LegDetail>
            {interlineFollows ? (
              <span>
                Stay on board at <b>{leg.to.name}</b>
              </span>
            ) : (
              <span>
                Get off at <b>{leg.to.name}</b> at{" "}
                {formatTime(leg.endTime, timeOptions)}
              </span>
            )}
          </Styled.LegDetail>
        </Styled.LegDetails>
      </Styled.LegBody>
    </Styled.Leg>
  );
}

TransitLeg.propTypes = {
  interlineFollows: PropTypes.bool,
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  timeOptions: timeOptionsType
};

TransitLeg.defaultProps = {
  interlineFollows: false,
  timeOptions: null
};

function AccessLeg({ config, leg, LegIcon }) {
  return (
    <Styled.Leg>
      <Styled.ModeIcon>
        <LegIcon leg={leg} />
      </Styled.ModeIcon>
      <Styled.LegBody>
        <Styled.LegHeader>
          {getLegModeLabel(leg)}{" "}
          {leg.distance > 0 && (
            <span> {humanizeDistanceString(leg.distance)}</span>
          )}
          {` to ${getPlaceName(leg.to, config.companies)}`}
        </Styled.LegHeader>
        {!leg.hailedCar && (
          <Styled.LegDetails>
            {leg.steps.map((step, k) => {
              return (
                <Styled.LegDetail key={k}>
                  {getStepDirection(step)} on <b>{getStepStreetName(step)}</b>
                </Styled.LegDetail>
              );
            })}
          </Styled.LegDetails>
        )}
      </Styled.LegBody>
    </Styled.Leg>
  );
}

AccessLeg.propTypes = {
  config: configType.isRequired,
  leg: legType.isRequired,
  LegIcon: PropTypes.element.isRequired
};

function TNCLeg({ leg, LegIcon }) {
  const { tncData } = leg;
  if (!tncData) return null;

  return (
    <Styled.Leg>
      <Styled.ModeIcon>
        <LegIcon leg={leg} />
      </Styled.ModeIcon>
      <Styled.LegBody>
        <Styled.LegHeader>
          <b>Take {tncData.displayName}</b> to <b>{leg.to.name}</b>
        </Styled.LegHeader>
        <Styled.LegDetails>
          <Styled.LegDetail>
            Estimated wait time for pickup:{" "}
            <b>{formatDuration(tncData.estimatedArrival)}</b>
          </Styled.LegDetail>
          <Styled.LegDetail>
            Estimated travel time: <b>{formatDuration(leg.duration)}</b> (does
            not account for traffic)
          </Styled.LegDetail>
        </Styled.LegDetails>
      </Styled.LegBody>
    </Styled.Leg>
  );
}

TNCLeg.propTypes = {
  leg: legType.isRequired,
  LegIcon: PropTypes.element.isRequired
};
