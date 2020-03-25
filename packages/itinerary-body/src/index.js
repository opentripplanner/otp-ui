import {
  configType,
  itineraryType,
  legType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import PlaceRow from "./place-row";
import * as Styled from "./styled";

const ItineraryBody = ({
  LegIcon,
  className,
  config,
  diagramVisible,
  frameLeg,
  itinerary,
  LineColumnContent,
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
  timeOptions,
  toRouteAbbreviation,
  TransitLegSummary
}) => {
  /*
    TODO: replace component should update logic? companies is simply used to
    trigger a rerender of this component itinerary is also another criteria
    that is used to trigger a rerender but has more reuse than companies here
  */
  const rows = [];
  let followsTransit = false;
  let lastLeg;
  itinerary.legs.forEach((leg, i) => {
    function createPlaceRow(isDestination) {
      // Create a row containing this leg's start place and leg traversal details
      rows.push(
        <PlaceRow
          // eslint-disable-next-line react/no-array-index-key
          key={i + (isDestination ? 1 : 0)}
          config={config}
          diagramVisible={diagramVisible}
          followsTransit={isDestination && followsTransit}
          frameLeg={frameLeg}
          lastLeg={lastLeg}
          leg={isDestination ? undefined : leg}
          LegIcon={LegIcon}
          legIndex={isDestination ? undefined : i}
          LineColumnContent={LineColumnContent}
          place={isDestination ? leg.to : leg.from}
          PlaceName={PlaceName}
          RouteDescription={RouteDescription}
          routingType={routingType}
          setActiveLeg={setActiveLeg}
          setLegDiagram={setLegDiagram}
          setViewedTrip={setViewedTrip}
          showAgencyInfo={showAgencyInfo}
          showElevationProfile={showElevationProfile}
          showLegIcon={showLegIcon}
          showMapButtonColumn={showMapButtonColumn}
          time={isDestination ? leg.endTime : leg.startTime}
          timeOptions={timeOptions}
          toRouteAbbreviation={toRouteAbbreviation}
          TransitLegSummary={TransitLegSummary}
        />
      );
    }

    createPlaceRow();
    // If this is the last leg, create a special PlaceRow for the destination
    // only
    if (i === itinerary.legs.length - 1) {
      createPlaceRow(true);
    }
    if (leg.transitLeg) followsTransit = true;
    lastLeg = leg;
  });
  return (
    <Styled.ItineraryBody className={className}>{rows}</Styled.ItineraryBody>
  );
};

ItineraryBody.propTypes = {
  /**
   * Used for additional styling with styled components for example.
   */
  className: PropTypes.string,
  /** Contains OTP configuration details. */
  config: configType.isRequired,
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible: legType,
  /** Called upon clicking the map icon. Called with an argument of the click event. */
  frameLeg: PropTypes.func,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: itineraryType.isRequired,
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: PropTypes.elementType.isRequired,
  /** A slot for a component that can render the content in the line column */
  LineColumnContent: PropTypes.elementType.isRequired,
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
  routingType: PropTypes.string,
  /**
   * Sets the active leg and legIndex.
   * Called with 2 arguments: (legIndex, leg)
   */
  setActiveLeg: PropTypes.func.isRequired,
  /** Handler for when a leg diagram is selected. */
  setLegDiagram: PropTypes.func.isRequired,
  /** Fired when a user clicks on a view trip button of a transit leg */
  setViewedTrip: PropTypes.func.isRequired,
  /** If true, will show agency information in transit legs */
  showAgencyInfo: PropTypes.bool,
  /** If true, will show the elevation profile for walk/bike legs */
  showElevationProfile: PropTypes.bool,
  /** If true will show the leg icon in the leg body */
  showLegIcon: PropTypes.bool,
  /** If true, will show the right column with the map button */
  showMapButtonColumn: PropTypes.bool,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: timeOptionsType,
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: PropTypes.func.isRequired,
  /**
   * A custom component for rendering the summary of a transit leg.
   * The component is sent 2 props:
   * - leg: the transit leg
   * - stopsExpanded: whether the intermediate stop display is currently expanded
   */
  TransitLegSummary: PropTypes.elementType.isRequired
};

const noop = () => {};

ItineraryBody.defaultProps = {
  className: null,
  diagramVisible: null,
  frameLeg: noop,
  routingType: "ITINERARY",
  showAgencyInfo: false,
  showElevationProfile: false,
  showLegIcon: false,
  showMapButtonColumn: true,
  timeOptions: null
};

export default ItineraryBody;
