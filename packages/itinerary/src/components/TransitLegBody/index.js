import React, { useState } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styled";
import { formatDuration } from "../../utils/time";

const TransitLegBody = ({
  leg,
  legIndex,
  setActiveLeg,
  // Service alerts uses this
  // eslint-disable-next-line no-unused-vars
  longDateFormat,
  operator,
  // Service alerts uses this
  // eslint-disable-next-line no-unused-vars
  timeFormat
}) => {
  const [stopsExpanded, setStopsExpanded] = useState(false);
  // const [alertsExpanded, setAlertsExpanded] = useState(false);
  const {
    agencyBrandingUrl,
    // eslint-disable-next-line no-unused-vars
    agencyName,
    // eslint-disable-next-line no-unused-vars
    agencyUrl,
    // eslint-disable-next-line no-unused-vars
    alerts,
    mode,
    routeShortName,
    routeLongName,
    headsign,
    interlineWithPreviousLeg,
    intermediateStops,
    duration
  } = leg;
  // This is tied to the agency display that is still being decided on
  // eslint-disable-next-line no-unused-vars
  const logoUrl = operator && operator.logo ? operator.logo : agencyBrandingUrl;

  return (
    <Styled.LegBody>
      {/* The Route Icon/Name Bar; clickable to set as active leg */}
      {/* TODO: double check if we need to hide this when interline */}
      {!interlineWithPreviousLeg && (
        <Styled.TransitLegSummary onClick={() => setActiveLeg(legIndex)}>
          <Styled.RouteLongName>
            Board {routeShortName}-{routeLongName}
            {headsign && (
              <>
                {" "}
                <Styled.Lighten>to </Styled.Lighten>
                {headsign}
              </>
            )}
            {/* TODO Need to add the arrival time here with early/late styling EG: Arriving in 9 min */}
          </Styled.RouteLongName>
        </Styled.TransitLegSummary>
      )}

      {/* Agency information */}
      {/* TODO: Marketing is checking to see if they plan show show/hide this. 
        It's ready to go if they want to keep it */}
      {/*
        <Styled.AgencyInfo>
          Service operated by{' '}
          <Styled.AgencyLink href={agencyUrl}>
            {agencyName}
            {logoUrl && (
              <Styled.AgencyLogo src={logoUrl} agencyName={agencyName} />
            )}
          </Styled.AgencyLink>
        </Styled.AgencyInfo>
      */}

      {/* 
        TODO: In the mocks, alerts look to be shown as a list of service alerts 
        while in OTP-RR this is a collapsible list -- need for figure out which direction
        we're going in for this. Have a question into their design team about this
      */}

      {/* Alerts toggle */}
      {/* {alerts && alerts.length > 0 && (
        <div
          onClick={this._onToggleAlertsClick}
          className="transit-alerts-toggle"
        >
          <i className="fa fa-exclamation-triangle" /> {alerts.length}{' '}
          {pluralize('alert', alerts)}{' '}
          <i
            className={`fa fa-caret-${
              this.state.alertsExpanded ? 'up' : 'down'
            }`}
          />
        </div>
      )} */}

      {/* The Alerts body, if visible */}
      {/* <VelocityTransitionGroup
        enter={{ animation: 'slideDown' }}
        leave={{ animation: 'slideUp' }}
      >
        {alertsExpanded && (
          <AlertsBody
            alerts={leg.alerts}
            longDateFormat={longDateFormat}
            timeFormat={timeFormat}
          />
        )}
      </VelocityTransitionGroup> */}
      {/* The "Ride X Min / X Stops" Row, including IntermediateStops body */}
      {intermediateStops && intermediateStops.length > 0 && (
        <Styled.TransitLegDetails>
          <Styled.TransitLegDetailsHeader
            onClick={() => setStopsExpanded(!stopsExpanded)}
          >
            {duration && <>{formatDuration(duration)} ride</>}
            {intermediateStops && (
              <>
                {" ("}
                {intermediateStops.length + 1}
                {" stops) "}
              </>
            )}
            <Styled.ExpandIcon
              expanded={stopsExpanded.toString()}
              mode={mode}
            />
          </Styled.TransitLegDetailsHeader>

          {/* TODO: This does not show up on the mocks. We should ask if trimet
          wants us to carry this feature forward */}
          {/* The ViewTripButton. TODO: make configurable */}
          {/* <ViewTripButton
          //     tripId={leg.tripId}
          //     fromIndex={leg.from.stopIndex}
          //     toIndex={leg.to.stopIndex}
          //   /> */}

          <Styled.IntermediateStopsListWrapper
            expanded={stopsExpanded.toString()}
          >
            <Styled.IntermediateStopsList>
              {stopsExpanded
                ? intermediateStops.map(stop => (
                    <Styled.IntermediateStopRow key={stop.stopId}>
                      {/* TODO: Positioning this stop marker will be tricky */}
                      <Styled.StopMarker>&bull;</Styled.StopMarker>
                      <Styled.StopName>{stop.name}</Styled.StopName>
                    </Styled.IntermediateStopRow>
                  ))
                : null}
            </Styled.IntermediateStopsList>
          </Styled.IntermediateStopsListWrapper>
        </Styled.TransitLegDetails>

        // TODO: What is this and do we want to include it?
        // {/* Average wait details, if present */}
        // {leg.averageWait && (
        //   <span>Typical Wait: {formatDuration(leg.averageWait)}</span>
        // )}
        // </div>
      )}
    </Styled.LegBody>
  );
};

TransitLegBody.propTypes = {
  /** Contains details about leg object that is being displayed */
  leg: PropTypes.shape({
    agencyBrandingUrl: PropTypes.string,
    agencyName: PropTypes.string.isRequired,
    agencyUrl: PropTypes.string.isRequired,
    alerts: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
    routeShortName: PropTypes.string.isRequired,
    routeLongName: PropTypes.string.isRequired,
    headsign: PropTypes.string.isRequired,
    interlineWithPreviousLeg: PropTypes.bool.isRequired,
    intermediateStops: PropTypes.arrayOf(
      PropTypes.shape({
        stopId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ),
    duration: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired
  }).isRequired,
  /** The index value of this specific leg within the itinerary */
  legIndex: PropTypes.number.isRequired,
  /** Sets the active leg */
  setActiveLeg: PropTypes.func.isRequired,
  /** The preferred format string for displaying long dates */
  longDateFormat: PropTypes.string.isRequired,
  /** Contains details about the operator of this transit leg */
  operator: PropTypes.shape({
    logo: PropTypes.string
  }),
  /** Contains the preferred format for displayed times */
  timeFormat: PropTypes.string.isRequired
};

TransitLegBody.defaultProps = {
  operator: null
};

export default TransitLegBody;
