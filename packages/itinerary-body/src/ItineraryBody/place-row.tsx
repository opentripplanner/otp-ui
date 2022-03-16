import coreUtils from "@opentripplanner/core-utils";
import { Config, Fare, Leg, TimeOptions } from "@opentripplanner/types";
import React, { FunctionComponent, ReactElement } from "react";

import DefaultTimeColumnContent from "../defaults/time-column-content";
import AccessLegBody from "../AccessLegBody";
import * as S from "../styled";
import TransitLegBody from "../TransitLegBody";

import AccessibilityRating from "./accessibility-rating";
import {
  FrameLegFunction,
  GradationMap,
  LegIconComponent,
  LineColumnContentProps,
  PlaceNameProps,
  RouteDescriptionProps,
  SetActiveLegFunction,
  SetViewedTripFunction,
  TimeColumnContentProps,
  ToRouteAbbreviationFunction,
  TransitLegSubheaderProps,
  TransitLegSummaryProps
} from "../types";

// const messagesType = PropTypes.shape({
//   mapIconTitle: PropTypes.string.isRequired
// });

// Many of these props are passed through from the ItineraryBody. See the
// documentation in that component for more information.
interface Props {
  accessibilityScoreGradationMap?: GradationMap;
  AlertToggleIcon?: FunctionComponent;
  AlertBodyIcon: FunctionComponent;
  config: Config;
  diagramVisible?: Leg;
  fare: Fare;
  /** Indicates whether this leg directly follows a transit leg */
  followsTransit?: boolean;
  frameLeg: FrameLegFunction;
  /** whether this place row represents the destination */
  isDestination: boolean;
  /** Contains details about the leg object prior to the current one */
  lastLeg?: Leg;
  /** Contains details about leg object that is being displayed */
  leg: Leg;
  LegIcon: LegIconComponent;
  /** The index value of this specific leg within the itinerary */
  legIndex: number;
  LineColumnContent: FunctionComponent<LineColumnContentProps>;
  mapillaryCallback?: (id: string) => void;
  mapillaryKey?: string;
  messages: any; // FIXME messagesType,
  PlaceName: FunctionComponent<PlaceNameProps>;
  RouteDescription: FunctionComponent<RouteDescriptionProps>;
  setActiveLeg: SetActiveLegFunction;
  setLegDiagram: (leg: Leg) => void;
  setViewedTrip: SetViewedTripFunction;
  showAgencyInfo: boolean;
  showElevationProfile: boolean;
  showLegIcon: boolean;
  showMapButtonColumn: boolean;
  showViewTripButton: boolean;
  TimeColumnContent: FunctionComponent<TimeColumnContentProps>;
  timeOptions: TimeOptions;
  toRouteAbbreviation: ToRouteAbbreviationFunction;
  TransitLegSubheader: FunctionComponent<TransitLegSubheaderProps>;
  TransitLegSummary: FunctionComponent<TransitLegSummaryProps>;
}

/*
  TODO: Wondering if it's possible for us to destructure the time
  preferences from the config object and avoid making the props list so long
*/
export default function PlaceRow({
  accessibilityScoreGradationMap,
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
  messages = {
    mapIconTitle: "View on map"
  },
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
  timeOptions,
  toRouteAbbreviation,
  TransitLegSubheader,
  TransitLegSummary,
  AlertToggleIcon,
  AlertBodyIcon
}: Props): ReactElement {
  // NOTE: Previously there was a check for itineraries that changed vehicles
  // at a single stop, which would render the stop place the same as the
  // interline stop. However, this prevents the user from being able to click
  // on the stop viewer in this case, which they may want to do in order to
  // check the real-time arrival information for the next leg of their journey.
  const interline = !!(!isDestination && leg.interlineWithPreviousLeg);
  const hideBorder = interline || !legIndex;
  const place = isDestination ? leg.to : leg.from;

  const { longDateFormat, timeFormat } = config.dateTime;
  return (
    <S.PlaceRowWrapper key={legIndex || "destination-place"}>
      <S.TimeColumn>
        {/* Custom rendering of the departure/arrival time of the specified leg. */}
        <TimeColumnContent
          isDestination={isDestination}
          leg={leg}
          timeOptions={timeOptions}
        />
        {!isDestination && leg.accessibilityScore && (
          <AccessibilityRating
            gradationMap={accessibilityScoreGradationMap}
            score={leg.accessibilityScore}
          />
        )}
      </S.TimeColumn>
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
      <S.DetailsColumn hideBorder={hideBorder.toString()}>
        <S.PlaceDetails>
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

          {/* Show the leg, if not rendering the destination */}
          {!isDestination &&
            (leg.transitLeg ? (
              /* This is a transit leg */
              <TransitLegBody
                config={config}
                fare={fare}
                leg={leg}
                LegIcon={LegIcon}
                legIndex={legIndex}
                setActiveLeg={setActiveLeg}
                longDateFormat={longDateFormat}
                RouteDescription={RouteDescription}
                setViewedTrip={setViewedTrip}
                showAgencyInfo={showAgencyInfo}
                showViewTripButton={showViewTripButton}
                timeFormat={timeFormat}
                TransitLegSubheader={TransitLegSubheader}
                TransitLegSummary={TransitLegSummary}
                transitOperator={coreUtils.route.getTransitOperatorFromLeg(
                  leg,
                  config.transitOperators
                )}
                AlertToggleIcon={AlertToggleIcon}
                AlertBodyIcon={AlertBodyIcon}
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
                timeOptions={timeOptions}
              />
            ))}
        </S.PlaceDetails>
      </S.DetailsColumn>
      {showMapButtonColumn && (
        <S.MapButtonColumn hideBorder={hideBorder.toString()}>
          <S.MapButton
            aria-label={messages.mapIconTitle}
            onClick={() => frameLeg({ isDestination, leg, legIndex, place })}
            title={messages.mapIconTitle}
          >
            <S.MapIcon title={messages.mapIconTitle} />
          </S.MapButton>
        </S.MapButtonColumn>
      )}
    </S.PlaceRowWrapper>
  );
}
