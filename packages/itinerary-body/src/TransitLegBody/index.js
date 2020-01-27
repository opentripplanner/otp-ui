import moment from "moment";
import {
  legType,
  transitOperatorType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { ExclamationTriangle } from "styled-icons/fa-solid";
import { VelocityTransitionGroup } from "velocity-react";

import { formatDuration } from "@opentripplanner/core-utils/lib/time";

import * as Styled from "../styled";
import ViewTripButton from "./view-trip-button";

// TODO use pluralize that for internationalization (and complex plurals, i.e., not just adding 's')
function pluralize(str, list) {
  return `${str}${list.length > 1 ? "s" : ""}`;
}

function DefaultTransitLegSummary({ leg, stopsExpanded }) {
  return (
    <>
      {leg.duration && <span>Ride {formatDuration(leg.duration)}</span>}
      {leg.intermediateStops && (
        <span>
          {" / "}
          {leg.intermediateStops.length + 1}
          {" stops "}
          <Styled.CaretToggle expanded={stopsExpanded} />
        </span>
      )}
    </>
  );
}

DefaultTransitLegSummary.propTypes = {
  leg: legType.isRequired,
  stopsExpanded: PropTypes.bool.isRequired
};

function DefaultRouteDescription({ leg }) {
  const { headsign, routeLongName, routeShortName } = leg;
  return (
    <Styled.LegDescriptionForTransit>
      {routeShortName && (
        <div>
          <Styled.LegDescriptionRouteShortName>
            {routeShortName}
          </Styled.LegDescriptionRouteShortName>
        </div>
      )}
      <Styled.LegDescriptionRouteLongName>
        {routeLongName}
        {headsign && (
          <span>
            <Styled.LegDescriptionHeadsignPrefix>
              {" to "}
            </Styled.LegDescriptionHeadsignPrefix>
            {headsign}
          </span>
        )}
      </Styled.LegDescriptionRouteLongName>
    </Styled.LegDescriptionForTransit>
  );
}

DefaultRouteDescription.propTypes = {
  leg: legType.isRequired
};

class TransitLegBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertsExpanded: false,
      stopsExpanded: false
    };
  }

  onToggleStopsClick = () => {
    const { stopsExpanded } = this.state;
    this.setState({ stopsExpanded: !stopsExpanded });
  };

  onToggleAlertsClick = () => {
    const { alertsExpanded } = this.state;
    this.setState({ alertsExpanded: !alertsExpanded });
  };

  onSummaryClick = () => {
    const { leg, legIndex, setActiveLeg } = this.props;
    setActiveLeg(legIndex, leg);
  };

  render() {
    const {
      leg,
      longDateFormat,
      RouteDescription,
      setViewedTrip,
      showAgencyInfo,
      timeFormat,
      TransitLegSummary,
      transitOperator
    } = this.props;
    const { agencyBrandingUrl, agencyName, agencyUrl, alerts } = leg;
    const { alertsExpanded, stopsExpanded } = this.state;

    // If the config contains an operator with a logo URL, prefer that over the
    // one provided by OTP (which is derived from agency.txt#agency_branding_url)
    const logoUrl =
      transitOperator && transitOperator.logo
        ? transitOperator.logo
        : agencyBrandingUrl;

    const expandAlerts =
      alertsExpanded || (leg.alerts && leg.alerts.length < 3);

    return (
      <Styled.LegBody>
        {/* The Route Icon/Name Bar; clickable to set as active leg */}
        <Styled.LegClickable onClick={this.onSummaryClick}>
          <RouteDescription leg={leg} transitOperator={transitOperator} />
        </Styled.LegClickable>

        {/* Agency information */}
        {showAgencyInfo && (
          <Styled.AgencyInfo>
            Service operated by{" "}
            <a href={agencyUrl} rel="noopener noreferrer" target="_blank">
              {agencyName}
              {logoUrl && (
                <img alt={`${agencyName} logo`} src={logoUrl} height={25} />
              )}
            </a>
          </Styled.AgencyInfo>
        )}

        {/* Alerts toggle */}
        {alerts && alerts.length > 2 && (
          <Styled.TransitAlertToggle onClick={this.onToggleAlertsClick}>
            <ExclamationTriangle size={15} /> {alerts.length}{" "}
            {pluralize("alert", alerts)}{" "}
            <Styled.CaretToggle expanded={alertsExpanded} />
          </Styled.TransitAlertToggle>
        )}

        {/* The Alerts body, if visible */}
        <VelocityTransitionGroup
          enter={{ animation: "slideDown" }}
          leave={{ animation: "slideUp" }}
        >
          {expandAlerts && (
            <AlertsBody
              alerts={leg.alerts}
              longDateFormat={longDateFormat}
              timeFormat={timeFormat}
            />
          )}
        </VelocityTransitionGroup>
        {/* The "Ride X Min / X Stops" Row, including IntermediateStops body */}
        {leg.intermediateStops && leg.intermediateStops.length > 0 && (
          <Styled.TransitLegDetails>
            {/* The header summary row, clickable to expand intermediate stops */}
            <Styled.TransitLegDetailsHeader onClick={this.onToggleStopsClick}>
              <TransitLegSummary leg={leg} stopsExpanded={stopsExpanded} />

              {/* The ViewTripButton. TODO: make configurable */}
              <ViewTripButton
                tripId={leg.tripId}
                fromIndex={leg.from.stopIndex}
                setViewedTrip={setViewedTrip}
                toIndex={leg.to.stopIndex}
              />
            </Styled.TransitLegDetailsHeader>
            {/* IntermediateStops expanded body */}
            <VelocityTransitionGroup
              enter={{ animation: "slideDown" }}
              leave={{ animation: "slideUp" }}
            >
              {stopsExpanded ? (
                <IntermediateStops stops={leg.intermediateStops} />
              ) : null}
            </VelocityTransitionGroup>

            {/* Average wait details, if present */}
            {leg.averageWait && (
              <span>Typical Wait: {formatDuration(leg.averageWait)}</span>
            )}
          </Styled.TransitLegDetails>
        )}
      </Styled.LegBody>
    );
  }
}

TransitLegBody.propTypes = {
  leg: legType.isRequired,
  legIndex: PropTypes.number.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  RouteDescription: PropTypes.elementType,
  setActiveLeg: PropTypes.func.isRequired,
  setViewedTrip: PropTypes.func.isRequired,
  showAgencyInfo: PropTypes.bool.isRequired,
  timeFormat: PropTypes.string.isRequired,
  TransitLegSummary: PropTypes.elementType,
  transitOperator: transitOperatorType
};

TransitLegBody.defaultProps = {
  RouteDescription: DefaultRouteDescription,
  TransitLegSummary: DefaultTransitLegSummary,
  transitOperator: null
};

export default TransitLegBody;

function IntermediateStops({ stops }) {
  return (
    <Styled.IntermediateStops>
      {stops.map((stop, k) => {
        return (
          <Styled.StopRow key={k}>
            <Styled.StopMarker>&bull;</Styled.StopMarker>
            <Styled.StopName>{stop.name}</Styled.StopName>
          </Styled.StopRow>
        );
      })}
    </Styled.IntermediateStops>
  );
}

IntermediateStops.propTypes = {
  stops: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

function AlertsBody({ alerts, longDateFormat, timeFormat }) {
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
                <ExclamationTriangle size={18} />
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
  timeFormat: PropTypes.string.isRequired
};
