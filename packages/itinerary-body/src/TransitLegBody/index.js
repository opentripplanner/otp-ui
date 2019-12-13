import React, { Component } from "react";
import PropTypes from "prop-types";
import { VelocityTransitionGroup } from "velocity-react";
import moment from "moment";

import { formatDuration } from "@opentripplanner/core-utils/lib/time";

import ViewTripButton from "./view-trip-button";
import { customIconsType, legType } from "../types";

function getIcon() {
  // TODO have this be a prop?
}

// TODO use pluralize that for internationalization (and complex plurals, i.e., not just adding 's')
function pluralize(str, list) {
  return `${str}${list.length > 1 ? "s" : ""}`;
}

// TODO: support multi-route legs for profile routing

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
      customIcons,
      leg,
      longDateFormat,
      operator,
      timeFormat
    } = this.props;
    const {
      agencyBrandingUrl,
      agencyName,
      agencyUrl,
      alerts,
      mode,
      routeShortName,
      routeLongName,
      headsign
    } = leg;
    const { alertsExpanded, stopsExpanded } = this.state;

    // If the config contains an operator with a logo URL, prefer that over the
    // one provided by OTP (which is derived from agency.txt#agency_branding_url)
    const logoUrl =
      operator && operator.logo ? operator.logo : agencyBrandingUrl;

    // get the iconKey for the leg's icon
    let iconKey = mode;
    if (typeof customIcons.customIconForLeg === "function") {
      const customIcon = customIcons.customIconForLeg(leg);
      if (customIcon) iconKey = customIcon;
    }

    return (
      <div className="leg-body">
        {/* The Route Icon/Name Bar; clickable to set as active leg */}
        {/* eslint-disable-next-line */}
        <div className="summary" onClick={this.onSummaryClick}>
          <div className="route-name leg-description">
            <div>
              <div className="icon">{getIcon(iconKey, customIcons)}</div>
            </div>
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
        </div>

        {/* Agency information */}
        {
          <div className="agency-info">
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
          </div>
        }

        {/* Alerts toggle */}
        {alerts && alerts.length > 0 && (
          <div
            nClick={this.onToggleAlertsClick}
            className="transit-alerts-toggle"
          >
            <i className="fa fa-exclamation-triangle" /> {alerts.length}{" "}
            {pluralize("alert", alerts)}{" "}
            <i className={`fa fa-caret-${alertsExpanded ? "up" : "down"}`} />
          </div>
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
                  <i
                    className={`fa fa-caret-${stopsExpanded ? "up" : "down"}`}
                  />
                </span>
              )}

              {/* The ViewTripButton. TODO: make configurable */}
              <ViewTripButton
                tripId={leg.tripId}
                fromIndex={leg.from.stopIndex}
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
      </div>
    );
  }
}

TransitLegBody.propTypes = {
  customIcons: customIconsType.isRequired,
  leg: legType.isRequired,
  legIndex: PropTypes.number.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  operator: PropTypes.string.isRequired,
  setActiveLeg: PropTypes.func.isRequired,
  timeFormat: PropTypes.string.isRequired
};

function IntermediateStops({ stops }) {
  return (
    <div className="intermediate-stops">
      {stops.map((stop, k) => {
        return (
          <div className="stop-row" key={k}>
            <div className="stop-marker">&bull;</div>
            <div className="stop-name">{stop.name}</div>
          </div>
        );
      })}
    </div>
  );
}

IntermediateStops.propTypes = {
  stops: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

function AlertsBody({ alerts, longDateFormat, timeFormat }) {
  return (
    <div className="transit-alerts">
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
            <div key={i} className="transit-alert">
              <div className="alert-icon">
                <i className="fa fa-exclamation-triangle" />
              </div>
              {alert.alertHeaderText ? (
                <div className="alert-header">{alert.alertHeaderText}</div>
              ) : null}
              <div className="alert-body">{alert.alertDescriptionText}</div>
              <div className="effective-date">{effectiveDateString}</div>
            </div>
          );
        })}
    </div>
  );
}

AlertsBody.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  longDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired
};
