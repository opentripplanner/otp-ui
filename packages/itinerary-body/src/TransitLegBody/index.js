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

import * as Styled from "./styled";
import * as StyledLegs from "../styled-legs";
import ViewTripButton from "./view-trip-button";

// TODO use pluralize that for internationalization (and complex plurals, i.e., not just adding 's')
function pluralize(str, list) {
  return `${str}${list.length > 1 ? "s" : ""}`;
}

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
      setViewedTrip,
      timeFormat,
      transitOperator
    } = this.props;
    const {
      agencyBrandingUrl,
      agencyName,
      agencyUrl,
      alerts,
      routeShortName,
      routeLongName,
      headsign
    } = leg;
    const { alertsExpanded, stopsExpanded } = this.state;

    // If the config contains an operator with a logo URL, prefer that over the
    // one provided by OTP (which is derived from agency.txt#agency_branding_url)
    const logoUrl =
      transitOperator && transitOperator.logo
        ? transitOperator.logo
        : agencyBrandingUrl;

    // get the iconKey for the leg's icon
    // let iconKey = mode;
    // if (typeof customIcons.customIconForLeg === "function") {
    //   const customIcon = customIcons.customIconForLeg(leg);
    //   if (customIcon) iconKey = customIcon;
    // }

    return (
      <StyledLegs.LegBody>
        {/* The Route Icon/Name Bar; clickable to set as active leg */}
        {/* eslint-disable-next-line */}
        <StyledLegs.LegClickable onClick={this.onSummaryClick}>
          <div className="route-name leg-description">
            {routeShortName && (
              <div>
                <span className="route-short-name">{routeShortName}</span>
              </div>
            )}
            <div className="route-long-name">
              {routeLongName}
              {headsign && (
                <span>
                  {" "}
                  <span style={{ fontWeight: "200" }}>to</span> {headsign}
                </span>
              )}
            </div>
          </div>
        </StyledLegs.LegClickable>

        {/* Agency information */}
        {
          <Styled.AgencyInfo>
            Service operated by{" "}
            <a href={agencyUrl} rel="noopener noreferrer" target="_blank">
              {agencyName}
              {logoUrl && (
                <img
                  alt={`${agencyName} logo`}
                  src={logoUrl}
                  height={25}
                  style={{ marginLeft: "5px" }}
                />
              )}
            </a>
          </Styled.AgencyInfo>
        }

        {/* Alerts toggle */}
        {alerts && alerts.length > 0 && (
          <Styled.TransitAlertToggle onClick={this.onToggleAlertsClick}>
            <ExclamationTriangle size={15} /> {alerts.length}{" "}
            {pluralize("alert", alerts)}{" "}
            <StyledLegs.CaretToggle expanded={alertsExpanded} />
          </Styled.TransitAlertToggle>
        )}

        {/* The Alerts body, if visible */}
        <VelocityTransitionGroup
          enter={{ animation: "slideDown" }}
          leave={{ animation: "slideUp" }}
        >
          {alertsExpanded && (
            <AlertsBody
              alerts={leg.alerts}
              longDateFormat={longDateFormat}
              timeFormat={timeFormat}
            />
          )}
        </VelocityTransitionGroup>
        {/* The "Ride X Min / X Stops" Row, including IntermediateStops body */}
        {leg.intermediateStops && leg.intermediateStops.length > 0 && (
          <div className="transit-leg-details">
            {/* The header summary row, clickable to expand intermediate stops */}
            {/* eslint-disable-next-line */}
            <div onClick={this.onToggleStopsClick} className="header">
              {leg.duration && <span>Ride {formatDuration(leg.duration)}</span>}
              {leg.intermediateStops && (
                <span>
                  {" / "}
                  {leg.intermediateStops.length + 1}
                  {" stops "}
                  <StyledLegs.CaretToggle expanded={stopsExpanded} />
                </span>
              )}

              {/* The ViewTripButton. TODO: make configurable */}
              <ViewTripButton
                tripId={leg.tripId}
                fromIndex={leg.from.stopIndex}
                setViewedTrip={setViewedTrip}
                toIndex={leg.to.stopIndex}
              />
            </div>
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
          </div>
        )}
      </StyledLegs.LegBody>
    );
  }
}

TransitLegBody.propTypes = {
  leg: legType.isRequired,
  legIndex: PropTypes.number.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  setActiveLeg: PropTypes.func.isRequired,
  setViewedTrip: PropTypes.func.isRequired,
  timeFormat: PropTypes.string.isRequired,
  transitOperator: transitOperatorType
};

TransitLegBody.defaultProps = {
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
            <Styled.TransitAlert key={i}>
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
