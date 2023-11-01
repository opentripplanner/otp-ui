import coreUtils from "@opentripplanner/core-utils";
import {
  FareProductSelector,
  FlexBookingInfo,
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
  RouteDescriptionFooterProps,
  SetActiveLegFunction,
  SetViewedTripFunction,
  TransitLegSubheaderProps,
  TransitLegSummaryProps
} from "../types";
import { defaultMessages } from "../util";

import AlertsBody from "./alerts-body";
import IntermediateStops from "./intermediate-stops";
import ViewTripButton from "./view-trip-button";

interface Props {
  AlertBodyIcon?: FunctionComponent;
  AlertToggleIcon?: FunctionComponent;
  alwaysCollapseAlerts: boolean;
  defaultFareSelector?: FareProductSelector;
  intl: IntlShape;
  leg: Leg;
  legDestination: string;
  LegIcon: LegIconComponent;
  legIndex: number;
  RouteDescription: FunctionComponent<RouteDescriptionProps>;
  RouteDescriptionFooter: FunctionComponent<RouteDescriptionFooterProps>;
  setActiveLeg: SetActiveLegFunction;
  setViewedTrip: SetViewedTripFunction;
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

const maximumAlertCountToShowUncollapsed = 2;

/**
 * Helper function that assembles values for flex pickup/dropoff messages.
 */
function getFlexMessageValues(info: FlexBookingInfo) {
  // There used to be a variable `hasLeadTime` here. This should be brought back
  // if the leadTime check is ever to be more than just checking the value of
  // daysPrior (which can be done within react-intl)
  const hasPhone = !!info?.contactInfo?.phoneNumber;
  const leadDays = info?.latestBookingTime?.daysPrior;
  const phoneNumber = info?.contactInfo?.phoneNumber;
  return {
    action: hasPhone ? (
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.ItineraryBody.flexCallNumber"]}
        description="For calling a phone number."
        id="otpUi.ItineraryBody.flexCallNumber"
        values={{ phoneNumber }}
      />
    ) : (
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.ItineraryBody.flexCallAhead"]}
        description="For calling ahead."
        id="otpUi.ItineraryBody.flexCallAhead"
      />
    ),
    advanceNotice:
      leadDays > 0 ? (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.ItineraryBody.flexAdvanceNotice"]
          }
          description="Advance notice for flex service."
          id="otpUi.ItineraryBody.flexAdvanceNotice"
          values={{ leadDays }}
        />
      ) : (
        ""
      )
  };
}

class TransitLegBody extends Component<Props, State> {
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

  render(): ReactElement {
    const {
      AlertBodyIcon,
      AlertToggleIcon = S.DefaultAlertToggleIcon,
      alwaysCollapseAlerts,
      defaultFareSelector,
      intl,
      leg,
      legDestination,
      LegIcon,
      RouteDescription,
      RouteDescriptionFooter,
      setViewedTrip,
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

    // If the config contains an operator name, prefer that one over the
    // one provided by OTP
    const transitOperatorName = transitOperator?.name || agencyName;

    // If the config contains an operator with a logo URL, prefer that over the
    // one provided by OTP (which is derived from agency.txt#agency_branding_url)
    const logoUrl =
      transitOperator && transitOperator.logo
        ? transitOperator.logo
        : agencyBrandingUrl;

    const shouldCollapseDueToAlertCount =
      leg.alerts?.length > maximumAlertCountToShowUncollapsed;
    // The alerts expansion triangle is shown when `!shouldOnlyShowAlertsExpanded`.
    // `!leg.alerts` is needed here so the triangle isn't shown when there are 0 alerts.
    const shouldOnlyShowAlertsExpanded =
      !(shouldCollapseDueToAlertCount || alwaysCollapseAlerts) || !leg.alerts;
    const expandAlerts = alertsExpanded || shouldOnlyShowAlertsExpanded;

    const legCost =
      defaultFareSelector &&
      coreUtils.itinerary.getLegCost(
        leg,
        defaultFareSelector.mediumId,
        defaultFareSelector.riderCategoryId
      );

    return (
      <>
        {TransitLegSubheader && <TransitLegSubheader leg={leg} />}
        <S.LegBody>
          {/* The Route Icon/Name Bar */}
          <S.LegClickable>
            <S.LegDescription>
              <span>
                <S.InvisibleAdditionalDetails>
                  {" - "}
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages["otpUi.TransitLegBody.ride"]
                    }
                    description="Prompt to ride a transit vehicle."
                    id="otpUi.TransitLegBody.ride"
                  />
                </S.InvisibleAdditionalDetails>
                <RouteDescription
                  leg={leg}
                  LegIcon={LegIcon}
                  transitOperator={transitOperator}
                />
                <S.InvisibleAdditionalDetails>
                  {" - "}
                  <FormattedMessage
                    // TODO: Accommodate interline itineraries with "Stay on board" instructions.
                    defaultMessage={
                      defaultMessages["otpUi.TransitLegBody.disembarkAt"]
                    }
                    description="Prompt to exit a transit vehicle."
                    id="otpUi.TransitLegBody.disembarkAt"
                    values={{
                      legDestination
                    }}
                  />
                </S.InvisibleAdditionalDetails>
              </span>
              <S.LegClickableButton onClick={this.onSummaryClick}>
                <S.InvisibleAdditionalDetails>
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages["otpUi.TransitLegBody.zoomToLeg"]
                    }
                    description="Identifies behavior of button"
                    id="otpUi.TransitLegBody.zoomToLeg"
                  />
                </S.InvisibleAdditionalDetails>
              </S.LegClickableButton>
            </S.LegDescription>
          </S.LegClickable>
          {RouteDescriptionFooter && <RouteDescriptionFooter leg={leg} />}
          <div
            // Creates a group of leg details for screenreaders after the initial leg description.
            aria-label={intl.formatMessage({
              defaultMessage:
                defaultMessages["otpUi.TransitLegBody.legDetails"],
              description: "Identifies this section as trip leg details",
              id: "otpUi.TransitLegBody.legDetails"
            })}
            role="group"
          >
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
                        aria-label={intl.formatMessage(
                          {
                            id: "otpUi.TransitLegBody.agencyExternalLink"
                          },
                          {
                            agencyName
                          }
                        )}
                        href={agencyUrl || "#"}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {transitOperatorName}
                        {logoUrl && <img alt="" src={logoUrl} height={25} />}
                      </a>
                    )
                  }}
                />
              </S.AgencyInfo>
            )}
            {isReservationRequired && leg.pickupBookingInfo && (
              <S.CallAheadWarning>
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.ItineraryBody.flexPickupMessage"]
                  }
                  description="Instructions for booking and boarding the flex (on-demand) transit service."
                  id="otpUi.ItineraryBody.flexPickupMessage"
                  values={getFlexMessageValues(leg.pickupBookingInfo)}
                />
              </S.CallAheadWarning>
            )}
            {/* Alerts toggle */}
            {alerts?.length > 0 && (
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
                      fromIndex={leg.from?.stopIndex}
                      fromStopId={leg?.from?.stopId}
                      setViewedTrip={setViewedTrip}
                      toIndex={leg.to?.stopIndex}
                      toStopId={leg?.to?.stopId}
                      tripId={leg.tripId}
                    />
                  )}
                </S.TransitLegDetailsHeader>
                {/* IntermediateStops expanded body */}
                <AnimateHeight
                  duration={500}
                  height={stopsExpanded ? "auto" : 0}
                >
                  <S.TransitLegExpandedBody>
                    <IntermediateStops stops={leg.intermediateStops} />
                    {legCost?.price && (
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
                                currency={legCost.price.currency.code}
                                currencyDisplay="narrowSymbol"
                                // This isn't a "real" style prop
                                // eslint-disable-next-line react/style-prop-object
                                style="currency"
                                value={legCost.price.amount}
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
          </div>
        </S.LegBody>
      </>
    );
  }
}

export default injectIntl(TransitLegBody);

export { AlertsBody, IntermediateStops, ViewTripButton };
