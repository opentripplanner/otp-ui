import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import DefaultTimeColumnContent from "./defaults/time-column-content";
import AccessLegBody from "./AccessLegBody";
import * as Styled from "./styled";
import TransitLegBody from "./TransitLegBody";

/*
  TODO: Wondering if it's possible for us to destructure the time
  preferences from the config object and avoid making the props list so long
*/
const PlaceRow = ({
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
  messages,
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
  TimeColumnContent,
  timeOptions,
  toRouteAbbreviation,
  TransitLegSubheader,
  TransitLegSummary,
  AlertToggleIcon,
  AlertBodyIcon
}) => {
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
    <Styled.PlaceRowWrapper key={legIndex || "destination-place"}>
      <Styled.TimeColumn>
        {/* Custom rendering of the departure/arrival time of the specified leg. */}
        <TimeColumnContent
          isDestination={isDestination}
          leg={leg}
          timeOptions={timeOptions}
        />
      </Styled.TimeColumn>
      <Styled.LineColumn>
        <LineColumnContent
          interline={interline}
          isDestination={isDestination}
          lastLeg={lastLeg}
          leg={leg}
          LegIcon={LegIcon}
          legIndex={legIndex}
          toRouteAbbreviation={toRouteAbbreviation}
        />
      </Styled.LineColumn>
      <Styled.DetailsColumn hideBorder={hideBorder.toString()}>
        <Styled.PlaceDetails>
          {/* Dot separating interlined segments, if applicable */}
          <Styled.PlaceHeader>
            {/*
              TODO: Need to rework this -- Need to display a marker
              for an interline place
            */}
            {interline && <Styled.InterlineDot>&bull;</Styled.InterlineDot>}
            <Styled.PlaceName>
              <PlaceName config={config} interline={interline} place={place} />
            </Styled.PlaceName>
          </Styled.PlaceHeader>

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
                setActiveLeg={setActiveLeg}
                setLegDiagram={setLegDiagram}
                showElevationProfile={showElevationProfile}
                showLegIcon={showLegIcon}
                timeOptions={timeOptions}
              />
            ))}
        </Styled.PlaceDetails>
      </Styled.DetailsColumn>
      {showMapButtonColumn && (
        <Styled.MapButtonColumn hideBorder={hideBorder.toString()}>
          <Styled.MapButton
            onClick={() => frameLeg({ isDestination, leg, legIndex, place })}
            title={messages.mapIconTitle}
          >
            <Styled.MapIcon />
          </Styled.MapButton>
        </Styled.MapButtonColumn>
      )}
    </Styled.PlaceRowWrapper>
  );
};

const messagesType = PropTypes.shape({
  mapIconTitle: PropTypes.string.isRequired
});

// A lot of these props are passed through from the ItineraryBody. See the
// documentation in that component for more information.
PlaceRow.propTypes = {
  config: coreUtils.types.configType.isRequired,
  diagramVisible: coreUtils.types.legType,
  fare: coreUtils.types.fareType,
  /** Indicates whether this leg directly follows a transit leg */
  followsTransit: PropTypes.bool,
  frameLeg: PropTypes.func.isRequired,
  /** whether this place row represents the destination */
  isDestination: PropTypes.bool.isRequired,
  /** Contains details about the leg object prior to the current one */
  lastLeg: coreUtils.types.legType,
  /** Contains details about leg object that is being displayed */
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  /** The index value of this specific leg within the itinerary */
  legIndex: PropTypes.number.isRequired,
  LineColumnContent: PropTypes.elementType.isRequired,
  messages: messagesType,
  PlaceName: PropTypes.elementType.isRequired,
  RouteDescription: PropTypes.elementType.isRequired,
  setActiveLeg: PropTypes.func.isRequired,
  setLegDiagram: PropTypes.func.isRequired,
  setViewedTrip: PropTypes.func.isRequired,
  showAgencyInfo: PropTypes.bool.isRequired,
  showElevationProfile: PropTypes.bool.isRequired,
  showLegIcon: PropTypes.bool.isRequired,
  showMapButtonColumn: PropTypes.bool.isRequired,
  showViewTripButton: PropTypes.bool.isRequired,
  TimeColumnContent: PropTypes.elementType,
  timeOptions: coreUtils.types.timeOptionsType,
  toRouteAbbreviation: PropTypes.func.isRequired,
  TransitLegSubheader: PropTypes.elementType,
  TransitLegSummary: PropTypes.elementType.isRequired,
  AlertToggleIcon: PropTypes.elementType,
  AlertBodyIcon: PropTypes.elementType
};

PlaceRow.defaultProps = {
  diagramVisible: null,
  fare: null,
  followsTransit: false,
  // can be null if this is the origin place
  lastLeg: null,
  messages: {
    mapIconTitle: "View on map"
  },
  TimeColumnContent: DefaultTimeColumnContent,
  timeOptions: null,
  TransitLegSubheader: undefined,
  AlertToggleIcon: undefined,
  AlertBodyIcon: undefined
};

export default PlaceRow;
