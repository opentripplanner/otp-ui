import { formatTime } from "@opentripplanner/core-utils/lib/time";
import {
  configType,
  legType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import AccessLegBody from "./AccessLegBody";
import * as Styled from "./styled";
import TransitLegBody from "./TransitLegBody";

/** Looks up an operator from the provided configuration */
const getTransitOperatorFromConfig = (id, config) =>
  config.transitOperators.find(transitOperator => transitOperator.id === id) ||
  null;

/*
  TODO: Wondering if it's possible for us to destructure the time
  preferences from the config object and avoid making the props list so long
*/
const PlaceRow = ({
  config,
  diagramVisible,
  followsTransit,
  frameLeg,
  lastLeg,
  leg,
  LegIcon,
  legIndex,
  LineColumnContent,
  place,
  PlaceName,
  RouteDescription,
  routingType,
  setActiveLeg,
  setLegDiagram,
  setViewedTrip,
  showAgencyInfo,
  showElevationProfile,
  showLegIcon,
  showMapButtonColumn,
  time,
  timeOptions,
  toRouteAbbreviation,
  TransitLegSubheader,
  TransitLegSummary
}) => {
  // NOTE: Previously there was a check for itineraries that changed vehicles
  // at a single stop, which would render the stop place the same as the
  // interline stop. However, this prevents the user from being able to click
  // on the stop viewer in this case, which they may want to do in order to
  // check the real-time arrival information for the next leg of their journey.
  const interline = !!(leg && leg.interlineWithPreviousLeg);
  const hideBorder = interline || !legIndex;
  const { longDateFormat, timeFormat } = config.dateTime;
  return (
    <Styled.PlaceRowWrapper key={legIndex || "destination-place"}>
      <Styled.TimeColumn>
        {time && formatTime(time, timeOptions)}
      </Styled.TimeColumn>
      <Styled.LineColumn>
        <LineColumnContent
          interline={interline}
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

          {/* Show the leg, if present */}
          {leg &&
            (leg.transitLeg ? (
              /* This is a transit leg */
              <TransitLegBody
                config={config}
                leg={leg}
                legIndex={legIndex}
                setActiveLeg={setActiveLeg}
                longDateFormat={longDateFormat}
                RouteDescription={RouteDescription}
                setViewedTrip={setViewedTrip}
                showAgencyInfo={showAgencyInfo}
                timeFormat={timeFormat}
                TransitLegSubheader={TransitLegSubheader}
                TransitLegSummary={TransitLegSummary}
                transitOperator={
                  leg.agencyId &&
                  getTransitOperatorFromConfig(leg.agencyId, config)
                }
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
                routingType={routingType}
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
          <Styled.MapButton onClick={frameLeg}>
            <Styled.MapIcon />
          </Styled.MapButton>
        </Styled.MapButtonColumn>
      )}
    </Styled.PlaceRowWrapper>
  );
};

PlaceRow.propTypes = {
  /** Contains OTP configuration details. */
  config: configType.isRequired,
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible: legType,
  /** Indicates whether this leg directly follows a transit leg */
  followsTransit: PropTypes.bool,
  /** Called upon clicking the map icon. Called with an argument of the click event. */
  frameLeg: PropTypes.func.isRequired,
  /** Contains details about the leg object prior to the current one */
  lastLeg: legType,
  /** Contains details about leg object that is being displayed */
  leg: legType,
  /** A component class used to render the icon for a leg */
  LegIcon: PropTypes.elementType.isRequired,
  /** The index value of this specific leg within the itinerary */
  legIndex: PropTypes.number,
  /** A slot for a component that can render the content in the line column */
  LineColumnContent: PropTypes.elementType.isRequired,
  /** Contains details about the place being featured in this block */
  place: PropTypes.shape({
    stopId: PropTypes.string,
    name: PropTypes.string.isRequired
  }).isRequired,
  /**
   * A custom component for rendering the place name of legs.
   * The component is sent 3 props:
   * - config: the application config
   * - interline: whether this place is an interlined stop (a stop where a
   *   transit vehicle changes routes, but a rider can continue riding without
   *   deboarding)
   * - place: the particular place. Typically this is the from place, but it
   *   could also be the to place if it is the destination of the itinerary.
   */
  PlaceName: PropTypes.elementType.isRequired,
  /**
   * A component to render the name of a route.
   *
   * The component is sent 2 props:
   * - leg: the itinerary leg with the transit information
   * - transitOperator: the transit operator associated with the route if available
   */
  RouteDescription: PropTypes.elementType.isRequired,
  /** TODO: Routing Type is usually 'ITINERARY' but we should get more details on what this does */
  routingType: PropTypes.string.isRequired,
  /**
   * Sets the active leg and legIndex.
   * Called with 2 arguments: (legIndex, leg)
   */
  setActiveLeg: PropTypes.func.isRequired,
  /** Fired when a user clicks on a view trip button of a transit leg */
  setViewedTrip: PropTypes.func.isRequired,
  /** If true, will show agency information in transit legs */
  showAgencyInfo: PropTypes.bool.isRequired,
  /** If true, will show the elevation profile for walk/bike legs */
  showElevationProfile: PropTypes.bool.isRequired,
  /** If true will show the leg icon in the leg body */
  showLegIcon: PropTypes.bool.isRequired,
  /** If true, will show the right column with the map button */
  showMapButtonColumn: PropTypes.bool.isRequired,
  /** Handler for when a leg diagram is selected. */
  setLegDiagram: PropTypes.func.isRequired,
  /** A unit timestamp of the time being featured in this block */
  time: PropTypes.number.isRequired,
  /** Contains an optional preferred format string for time display and a
  timezone offset */
  timeOptions: timeOptionsType,
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: PropTypes.func.isRequired,
  /**
   * An optional custom component for rendering a subheader on transit legs.
   * * The component is sent 1 prop:
   * - leg: the transit leg
   */
  TransitLegSubheader: PropTypes.elementType,
  /**
   * A custom component for rendering the summary of a transit leg.
   * The component is sent 2 props:
   * - leg: the transit leg
   * - stopsExpanded: whether the intermediate stop display is currently expanded
   */
  TransitLegSummary: PropTypes.elementType.isRequired
};

PlaceRow.defaultProps = {
  diagramVisible: null,
  followsTransit: false,
  // can be null if this is the origin place
  lastLeg: null,
  // can be null if this is the destination place
  leg: null,
  // can be null if this is the destination place
  legIndex: null,
  timeOptions: null,
  TransitLegSubheader: undefined
};

export default PlaceRow;
