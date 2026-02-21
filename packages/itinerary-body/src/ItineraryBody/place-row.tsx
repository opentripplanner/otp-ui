import coreUtils from "@opentripplanner/core-utils";
import { Config, Leg } from "@opentripplanner/types";
import React, { FunctionComponent, ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import DefaultTimeColumnContent from "../defaults/time-column-content";
import AccessLegBody from "../AccessLegBody";
import * as S from "../styled";
import TransitLegBody from "../TransitLegBody";

import AccessibilityRating from "./accessibility-rating";
import { PlaceNameProps, PlaceRowProps } from "../types";
import { defaultMessages } from "../util";

function getLegPlaceName(
  leg: Leg,
  isDestination: boolean,
  PlaceName: FunctionComponent<PlaceNameProps>,
  config: Config
) {
  // NOTE: Previously there was a check for itineraries that changed vehicles
  // at a single stop, which would render the stop place the same as the
  // interline stop. However, this prevents the user from being able to click
  // on the stop viewer in this case, which they may want to do in order to
  // check the real-time arrival information for the next leg of their journey.
  const interline = !!(!isDestination && leg.interlineWithPreviousLeg);
  const place = isDestination ? { ...leg.to } : { ...leg.from };
  const placeName = (
    <PlaceName config={config} interline={interline} place={place} />
  );

  return {
    interline,
    place,
    placeName
  };
}

/*
  TODO: Wondering if it's possible for us to destructure the time
  preferences from the config object and avoid making the props list so long
*/
export default function PlaceRow({
  accessibilityScoreGradationMap,
  AlightStepContent,
  AlertBodyIcon,
  AlertToggleIcon,
  alwaysCollapseAlerts,
  config,
  defaultFareSelector,
  diagramVisible,
  followsTransit,
  frameLeg,
  HeaderSequenceContent,
  isDestination,
  isLastLeg,
  lastLeg,
  leg,
  LegIcon,
  legIndex,
  LineColumnContent,
  mapillaryCallback,
  mapillaryKey,
  nextLeg,
  PlaceName,
  RouteDescription,
  RouteDescriptionFooter,
  setActiveLeg,
  setLegDiagram,
  setViewedTrip,
  showAgencyInfo,
  showAlertEffectiveDateTimeText,
  showApproximateAccessLegTravelTimes,
  showElevationProfile,
  showLegIcon,
  showMapButtonColumn,
  showViewTripButton,
  TimeColumnContent = DefaultTimeColumnContent,
  toRouteAbbreviation,
  TransitLegSubheader,
  TransitLegSummary
}: PlaceRowProps): ReactElement {
  // NOTE: Previously there was a check for itineraries that changed vehicles
  // at a single stop, which would render the stop place the same as the
  // interline stop. However, this prevents the user from being able to click
  // on the stop viewer in this case, which they may want to do in order to
  // check the real-time arrival information for the next leg of their journey.
  const { interline, place, placeName } = getLegPlaceName(
    leg,
    isDestination,
    PlaceName,
    config
  );
  const {
    interline: nextLegInterlines = false,
    placeName: nextPlaceName = undefined
  } = nextLeg ? getLegPlaceName(nextLeg, false, PlaceName, config) : {};
  const legDestination = nextPlaceName || (
    <PlaceName config={config} place={leg.to} />
  );

  // OTP2 marks both bikes and scooters as BIKESHARE in the vertextype
  // To get the right label, we need to fix scooters to be "VEHICLERENTAL"
  place.vertexType =
    leg.mode === "SCOOTER" && !isDestination
      ? "VEHICLERENTAL"
      : place.vertexType;

  const intl = useIntl();
  const viewOnMapMessage = intl.formatMessage({
    defaultMessage: defaultMessages["otpUi.ItineraryBody.viewOnMap"],
    description: "Text describing the view-on-map button",
    id: "otpUi.ItineraryBody.viewOnMap"
  });

  return (
    <S.PlaceRowWrapper
      $hasSequence={!!(HeaderSequenceContent && !isDestination)}
      className={`place-row-wrapper ${leg.transitLeg ? "transit" : ""} ${
        interline ? "interline" : ""
      } ${leg.rentedBike ? "rented-bike" : ""}`}
      key={legIndex || "destination-place"}
    >
      {HeaderSequenceContent && !isDestination && (
        <HeaderSequenceContent leg={leg} legIndex={legIndex} />
      )}
      <S.LineColumn>
        <LineColumnContent
          interline={interline}
          isDestination={isDestination}
          lastLeg={lastLeg}
          leg={leg}
          LegIcon={LegIcon}
          legIndex={legIndex}
          toRouteAbbreviation={toRouteAbbreviation}
        />
      </S.LineColumn>
      <S.PlaceHeader>
        <S.PlaceName aria-hidden className="place-row-place-name">
          {placeName}
        </S.PlaceName>
      </S.PlaceHeader>
      <S.TimeColumn>
        {/* Custom rendering of the departure/arrival time of the specified leg. */}
        <TimeColumnContent isDestination={isDestination} leg={leg} />
        {!isDestination &&
          leg.accessibilityScore !== null &&
          leg.accessibilityScore > -1 && (
            // TODO: Reorder markup so accessibility info doesn't fall between time and destination.
            <AccessibilityRating
              gradationMap={accessibilityScoreGradationMap}
              isLeg
              score={leg.accessibilityScore}
            />
          )}
      </S.TimeColumn>
      <S.InvisibleAdditionalDetails
        $hasSequence={!!(HeaderSequenceContent && !isDestination)}
      >
        {interline ? (
          placeName
        ) : !isDestination ? (
          <FormattedMessage
            description="Add starting location for access legs"
            id="otpUi.TransitLegBody.fromLocation"
            values={{ location: placeName }}
          />
        ) : (
          <FormattedMessage
            id="otpUi.TransitLegBody.arriveAt"
            defaultMessage={defaultMessages["otpUi.TransitLegBody.arriveAt"]}
            description="Identifies end of the trip to screenreaders"
            values={{ place: placeName }}
          />
        )}
      </S.InvisibleAdditionalDetails>
      <S.PlaceDetails
        className={`place-details ${leg.transitLeg ? "transit" : ""}`}
      >
        {/* Show the leg, if not rendering the destination */}
        {!isDestination &&
          (leg.transitLeg ? (
            /* This is a transit leg */
            <TransitLegBody
              AlertBodyIcon={AlertBodyIcon}
              AlertToggleIcon={AlertToggleIcon}
              alwaysCollapseAlerts={alwaysCollapseAlerts}
              defaultFareSelector={defaultFareSelector}
              leg={leg}
              legDestination={legDestination}
              LegIcon={LegIcon}
              legIndex={legIndex}
              nextLegInterlines={nextLegInterlines}
              RouteDescription={RouteDescription}
              RouteDescriptionFooter={RouteDescriptionFooter}
              setActiveLeg={setActiveLeg}
              setViewedTrip={setViewedTrip}
              showAgencyInfo={showAgencyInfo}
              showAlertEffectiveDateTimeText={showAlertEffectiveDateTimeText}
              showViewTripButton={showViewTripButton}
              timeZone={config.homeTimezone}
              TransitLegSubheader={TransitLegSubheader}
              TransitLegSummary={TransitLegSummary}
              transitOperator={coreUtils.route.getTransitOperatorFromLeg(
                leg,
                config.transitOperators
              )}
            />
          ) : (
            /* This is an access (e.g. walk/bike/etc.) leg */
            <AccessLegBody
              config={config}
              diagramVisible={diagramVisible}
              followsTransit={followsTransit}
              leg={leg}
              LegIcon={LegIcon}
              legIndex={legIndex}
              mapillaryCallback={mapillaryCallback}
              mapillaryKey={mapillaryKey}
              setActiveLeg={setActiveLeg}
              setLegDiagram={setLegDiagram}
              showApproximateTravelTime={showApproximateAccessLegTravelTimes}
              showElevationProfile={showElevationProfile}
              showLegIcon={showLegIcon}
              TransitLegSubheader={TransitLegSubheader}
            />
          ))}
        {/* Render alight step if a custom component is provided */}
        {AlightStepContent && !isDestination && !isLastLeg && (
          <AlightStepContent isDestination={false} leg={leg} />
        )}
      </S.PlaceDetails>
      {/* This prop is a string for some reason... */}
      {showMapButtonColumn && (
        <S.MapButtonColumn hideBorder="true">
          <S.MapButton
            aria-label={viewOnMapMessage}
            onClick={() => frameLeg({ isDestination, leg, legIndex, place })}
            title={viewOnMapMessage}
          >
            <S.MapIcon title={viewOnMapMessage} />
          </S.MapButton>
        </S.MapButtonColumn>
      )}
    </S.PlaceRowWrapper>
  );
}
