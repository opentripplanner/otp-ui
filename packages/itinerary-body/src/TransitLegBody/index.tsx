import coreUtils from "@opentripplanner/core-utils";
import {
  Fare,
  Leg,
  LegIconComponent,
  TransitOperator
} from "@opentripplanner/types";
import React, { Component, FunctionComponent, ReactElement } from "react";
import AnimateHeight from "react-animate-height";
import {
  FormattedMessage,
  FormattedNumber,
  injectIntl,
  IntlShape
} from "react-intl";
import { Duration } from "../defaults";

import * as S from "../styled";
import {
  RouteDescriptionProps,
  SetActiveLegFunction,
  SetViewedTripFunction,
  TransitLegSubheaderProps,
  TransitLegSummaryProps
} from "../types";
import { defaultMessages, getFlexMessageValues } from "../util";

import AlertsBody from "./alerts-body";
import IntermediateStops from "./intermediate-stops";
import ViewTripButton from "./view-trip-button";

interface Props {
  AlertBodyIcon?: FunctionComponent;
  AlertToggleIcon?: FunctionComponent;
  fare?: Fare;
  intl: IntlShape;
  leg: Leg;
  LegIcon: LegIconComponent;
  legIndex: number;
  RouteDescription: FunctionComponent<RouteDescriptionProps>;
  setActiveLeg: SetActiveLegFunction;
  setViewedTrip: SetViewedTripFunction;
  shouldAlwaysCollapseAlerts: boolean;
  showAgencyInfo: boolean;
  showViewTripButton: boolean;
  timeZone: string;
  TransitLegSubheader?: FunctionComponent<TransitLegSubheaderProps>;
  TransitLegSummary: FunctionComponent<TransitLegSummaryProps>;
  transitOperator?: TransitOperator;
}

interface State {
  alertsExpanded: boolean;
  stopsExpanded: boolean;
}

class TransitLegBody extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      alertsExpanded: false,
      stopsExpanded: false
    };
  }

  getFareForLeg = (leg: Leg, fare: Fare) => {
    let fareForLeg;
    fare?.details?.regular?.forEach(fareComponent => {
      if (fareComponent.routes?.includes(leg.routeId)) {
        fareForLeg = coreUtils.itinerary.getTransitFare(fareComponent.price);
      }
    });
    return fareForLeg;
  };

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

  render(): ReactElement {
    const {
      AlertToggleIcon = S.DefaultAlertToggleIcon,
      AlertBodyIcon,
      fare,
      intl,
      leg,
      LegIcon,
      RouteDescription,
      setViewedTrip,
      shouldAlwaysCollapseAlerts,
      showAgencyInfo,
      showViewTripButton,
      timeZone,
      TransitLegSubheader,
      TransitLegSummary,
      transitOperator
    } = this.props;
    const { agencyBrandingUrl, agencyName, agencyUrl, alerts } = leg;
    const { alertsExpanded, stopsExpanded } = this.state;

    const isReservationRequired = coreUtils.itinerary.isReservationRequired(
      leg
    );

    // If the config contains an operator with a logo URL, prefer that over the
    // one provided by OTP (which is derived from agency.txt#agency_branding_url)
    const logoUrl =
      transitOperator && transitOperator.logo
        ? transitOperator.logo
        : agencyBrandingUrl;

    const maximumAlertCountToShowUncollapsed = 2;
    const shouldCollapseDueToAlertCount =
      leg.alerts?.length > maximumAlertCountToShowUncollapsed;
    const shouldOnlyShowAlertsExpanded =
      !(shouldCollapseDueToAlertCount || shouldAlwaysCollapseAlerts) ||
      !leg.alerts;
    const expandAlerts = alertsExpanded || shouldOnlyShowAlertsExpanded;
    const fareForLeg = this.getFareForLeg(leg, fare);
    return (
      <>
        {TransitLegSubheader && <TransitLegSubheader leg={leg} />}
        <S.LegBody>
          {/* The Route Icon/Name Bar; clickable to set as active leg */}
          <S.LegClickable onClick={this.onSummaryClick}>
            <RouteDescription
              leg={leg}
              LegIcon={LegIcon}
              transitOperator={transitOperator}
            />
          </S.LegClickable>

          {/* Agency information */}
          {showAgencyInfo && (
            <S.AgencyInfo>
              <FormattedMessage
                defaultMessage={
                  defaultMessages["otpUi.TransitLegBody.operatedBy"]
                }
                description="Tells which agency operates the service"
                id="otpUi.TransitLegBody.operatedBy"
                values={{
                  agencyLink: (
                    <a
                      href={agencyUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {agencyName}
                      {logoUrl && (
                        <img
                          alt={intl.formatMessage(
                            {
                              defaultMessage:
                                defaultMessages[
                                  "otpUi.TransitLegBody.agencyLogo"
                                ],
                              description: "Alt text for agency logo",
                              id: "otpUi.TransitLegBody.agencyLogo"
                            },
                            {
                              agencyName
                            }
                          )}
                          src={logoUrl}
                          height={25}
                        />
                      )}
                    </a>
                  )
                }}
              />
            </S.AgencyInfo>
          )}
          {isReservationRequired && (
            <S.CallAheadWarning>
              {leg?.pickupBookingInfo && (
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.ItineraryBody.flexPickupMessage"]
                  }
                  description="Instructions for booking and boarding the flex (on-demand) transit service."
                  id="otpUi.ItineraryBody.flexPickupMessage"
                  values={getFlexMessageValues(leg?.pickupBookingInfo)}
                />
              )}
            </S.CallAheadWarning>
          )}

          {/* Alerts toggle */}
          {!shouldOnlyShowAlertsExpanded && (
            <S.TransitAlertToggle onClick={this.onToggleAlertsClick}>
              <AlertToggleIcon />{" "}
              <FormattedMessage
                defaultMessage={
                  defaultMessages["otpUi.TransitLegBody.alertsHeader"]
                }
                description="Number of alerts header"
                id="otpUi.TransitLegBody.alertsHeader"
                values={{
                  alertCount: alerts.length
                }}
              />
              <S.CaretToggle expanded={alertsExpanded} />
            </S.TransitAlertToggle>
          )}

          {/* The Alerts body, if visible */}
          <AnimateHeight duration={500} height={expandAlerts ? "auto" : 0}>
            <AlertsBody
              alerts={leg.alerts}
              AlertIcon={AlertBodyIcon}
              timeZone={timeZone}
            />
          </AnimateHeight>
          {/* The "Ride X Min / X Stops" Row, including IntermediateStops body */}
          {leg.intermediateStops && leg.intermediateStops.length > 0 && (
            <S.TransitLegDetails>
              {/* The header summary row, clickable to expand intermediate stops */}
              <S.TransitLegDetailsHeader>
                <TransitLegSummary
                  leg={leg}
                  onClick={this.onToggleStopsClick}
                  stopsExpanded={stopsExpanded}
                />

                {showViewTripButton && (
                  <ViewTripButton
                    tripId={leg.tripId}
                    fromIndex={leg.from.stopIndex}
                    setViewedTrip={setViewedTrip}
                    toIndex={leg.to.stopIndex}
                  />
                )}
              </S.TransitLegDetailsHeader>
              {/* IntermediateStops expanded body */}
              <AnimateHeight duration={500} height={stopsExpanded ? "auto" : 0}>
                <S.TransitLegExpandedBody>
                  <IntermediateStops stops={leg.intermediateStops} />
                  {fareForLeg && (
                    <S.TransitLegFare>
                      <FormattedMessage
                        defaultMessage={
                          defaultMessages["otpUi.TransitLegBody.fare"]
                        }
                        description="Describes the fare for a leg"
                        id="otpUi.TransitLegBody.fare"
                        values={{
                          fare: (
                            <FormattedNumber
                              currency={fareForLeg.currencyCode}
                              currencyDisplay="narrowSymbol"
                              // This isn't a "real" style prop
                              // eslint-disable-next-line react/style-prop-object
                              style="currency"
                              value={fareForLeg.transitFare / 100}
                            />
                          )
                        }}
                      />
                    </S.TransitLegFare>
                  )}
                </S.TransitLegExpandedBody>
              </AnimateHeight>

              {/* Average wait details, if present */}
              {leg.averageWait && (
                <span>
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages["otpUi.TransitLegBody.typicalWait"]
                    }
                    description="Describes the typical wait for a transit leg"
                    id="otpUi.TransitLegBody.typicalWait"
                    values={{
                      waitTime: <Duration seconds={leg.averageWait} />
                    }}
                  />
                </span>
              )}
            </S.TransitLegDetails>
          )}
        </S.LegBody>
      </>
    );
  }
}

export default injectIntl(TransitLegBody);

export { AlertsBody, IntermediateStops, ViewTripButton };
