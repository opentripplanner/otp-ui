import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";

import DefaultTimeColumnContent from "../defaults/time-column-content";
import AccessLegBody from "../AccessLegBody";
import * as S from "../styled";
import TransitLegBody from "../TransitLegBody";

import AccessibilityRating from "./accessibility-rating";
import { PlaceRowProps } from "../types";
import { defaultMessages } from "../util";

/*
  TODO: Wondering if it's possible for us to destructure the time
  preferences from the config object and avoid making the props list so long
*/
export default function PlaceRow({
  accessibilityScoreGradationMap,
  AlertBodyIcon,
  AlertToggleIcon,
  alwaysCollapseAlerts,
  config,
  diagramVisible,
  fare,
  followsTransit,
  frameLeg,
  isDestination,
  lastLeg,
  leg,
  LegIcon,
  legIndex,
  LineColumnContent,
  mapillaryCallback,
  mapillaryKey,
  PlaceName,
  RouteDescription,
  setActiveLeg,
  setLegDiagram,
  setViewedTrip,
  showAgencyInfo,
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
  const interline = !!(!isDestination && leg.interlineWithPreviousLeg);
  const hideBorder = interline || !legIndex;
  const place = isDestination ? { ...leg.to } : { ...leg.from };
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
    <S.PlaceRowWrapper key={legIndex || "destination-place"} role="group">
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
      {/* Dot separating interlined segments, if applicable */}
      <S.PlaceHeader>
        {/*
              TODO: Need to rework this -- Need to display a marker
              for an interline place
            */}
        {interline && <S.InterlineDot>&bull;</S.InterlineDot>}
        <S.PlaceName>
          <PlaceName config={config} interline={interline} place={place} />
        </S.PlaceName>
      </S.PlaceHeader>

      <S.TimeColumn>
        {/* Custom rendering of the departure/arrival time of the specified leg. */}
        <TimeColumnContent isDestination={isDestination} leg={leg} />
        {!isDestination && leg.accessibilityScore && (
          <AccessibilityRating
            gradationMap={accessibilityScoreGradationMap}
            score={leg.accessibilityScore}
          />
        )}
      </S.TimeColumn>
      <S.PlaceDetails>
        {/* Show the leg, if not rendering the destination */}
        {!isDestination &&
          (leg.transitLeg ? (
            /* This is a transit leg */
            <TransitLegBody
              AlertBodyIcon={AlertBodyIcon}
              AlertToggleIcon={AlertToggleIcon}
              alwaysCollapseAlerts={alwaysCollapseAlerts}
              fare={fare}
              leg={leg}
              LegIcon={LegIcon}
              legIndex={legIndex}
              RouteDescription={RouteDescription}
              setActiveLeg={setActiveLeg}
              setViewedTrip={setViewedTrip}
              showAgencyInfo={showAgencyInfo}
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
              showElevationProfile={showElevationProfile}
              showLegIcon={showLegIcon}
            />
          ))}
      </S.PlaceDetails>
      {showMapButtonColumn && (
        <S.MapButtonColumn hideBorder={hideBorder.toString()}>
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
