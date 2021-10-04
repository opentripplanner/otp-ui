import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import AccessibilityRating from "./accessibility-rating";
import PlaceRow from "./place-row";
import * as S from "../styled";

const ItineraryBody = ({
  accessibilityScoreGradationMap,
  AlertBodyIcon,
  AlertToggleIcon,
  className,
  config,
  diagramVisible,
  frameLeg,
  itinerary,
  LegIcon,
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
  showRouteFares,
  showViewTripButton,
  TimeColumnContent,
  timeOptions,
  toRouteAbbreviation,
  TransitLegSubheader,
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
  const { fare } = itinerary;
  itinerary.legs.forEach((leg, i) => {
    function createPlaceRow(isDestination) {
      // Create a row containing this leg's start place and leg traversal details
      rows.push(
        <PlaceRow
          AlertToggleIcon={AlertToggleIcon}
          AlertBodyIcon={AlertBodyIcon}
          accessibilityScoreGradationMap={accessibilityScoreGradationMap}
          // eslint-disable-next-line react/no-array-index-key
          key={i + (isDestination ? 1 : 0)}
          config={config}
          diagramVisible={diagramVisible}
          // Itinerary fare is only passed as prop if showRouteFares is enabled.
          // The fare details will be processed in the TransitLeg component and
          // shown for all legs.
          fare={showRouteFares ? fare : null}
          followsTransit={followsTransit}
          frameLeg={frameLeg}
          isDestination={isDestination}
          lastLeg={lastLeg}
          leg={leg}
          LegIcon={LegIcon}
          legIndex={i}
          LineColumnContent={LineColumnContent}
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
          showViewTripButton={showViewTripButton}
          TimeColumnContent={TimeColumnContent}
          timeOptions={timeOptions}
          toRouteAbbreviation={toRouteAbbreviation}
          TransitLegSubheader={TransitLegSubheader}
          TransitLegSummary={TransitLegSummary}
        />
      );
    }

    createPlaceRow(false);
    // If this is the last leg, create a special PlaceRow for the destination
    // only
    if (i === itinerary.legs.length - 1) {
      createPlaceRow(true);
    }
    if (leg.transitLeg) followsTransit = true;
    lastLeg = leg;
  });
  return <S.ItineraryBody className={className}>{rows}</S.ItineraryBody>;
};

ItineraryBody.propTypes = {
  /**
   * Used for additional styling with styled components for example.
   */
  className: PropTypes.string,
  /** Contains OTP configuration details. */
  config: coreUtils.types.configType.isRequired,
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible: coreUtils.types.legType,
  /**
   * Called upon clicking the map icon on place headers. This function is sent a
   * single argument of an object with the keys as follow:
   * - `leg`: the leg clicked (can be null if the destination is clicked)
   * - `legIndex`: the index of the leg clicked (can be null if the destination
   *    is clicked)
   * - `isDestination`: if the place header that is clicked is the destination
   * - `place`: The place associated with the click event
   */
  frameLeg: PropTypes.func,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: coreUtils.types.itineraryType.isRequired,
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: PropTypes.elementType.isRequired,
  /**
   * A slot for a component that can render the content in the line column.
   * This component is sent the following props:
   * - interline - whether this place is an interlined stop
   * - isDestination - whether this place is the destination
   * - lastLeg - the leg prior to the current leg
   * - leg - the current leg
   * - LegIcon - the LegIcon class used to render leg icons.
   * - legIndex - the current leg index
   * - toRouteAbbreviation - a function to help abbreviate route names
   */
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
  /** If true, will show fare information in transit leg bodies */
  showRouteFares: PropTypes.bool,
  /** If true, shows the view trip button in transit leg bodies */
  showViewTripButton: PropTypes.bool,
  /**
   * A slot for a component that can render the content in the time column portion of ItineraryBody.
   * This component is sent the following props:
   * - isDestination - whether this place is the destination
   * - leg - the current leg
   * - timeOptions - options for formatting time.
   */
  TimeColumnContent: PropTypes.elementType,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: coreUtils.types.timeOptionsType,
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: PropTypes.func,
  /**
   * An optional custom component for rendering a subheader on transit legs.
   * * The component is sent 4 props:
   * - languageConfig: The language values
   * - leg: the transit leg
   */
  TransitLegSubheader: PropTypes.elementType,
  /**
   * A custom component for rendering the summary of a transit leg.
   * The component is sent 2 props:
   * - leg: the transit leg
   * - stopsExpanded: whether the intermediate stop display is currently expanded
   */
  TransitLegSummary: PropTypes.elementType.isRequired,
  /**
   * A custom icon component inserted into the transit alert toggle button
   * within a transit leg, if this prop is not supplied a default icon is used
   */
  AlertToggleIcon: PropTypes.elementType,
  /**
   * A custom icon component inserted into the transit alert body component
   * within a transit leg, if this prop is not supplied a default icon is used
   */
  AlertBodyIcon: PropTypes.elementType,
  /**
   * A mapping of accessibility score to color, icon, and text used
   * to override the default one shipped in AccessibilityLabel
   */
  accessibilityScoreGradationMap: PropTypes.shape({
    color: PropTypes.string,
    icon: PropTypes.element,
    text: PropTypes.string
  })
};

function noop() {}

ItineraryBody.defaultProps = {
  accessibilityScoreGradationMap: undefined,
  AlertBodyIcon: undefined,
  AlertToggleIcon: undefined,
  className: null,
  diagramVisible: null,
  frameLeg: noop,
  routingType: "ITINERARY",
  showAgencyInfo: false,
  showElevationProfile: false,
  showLegIcon: false,
  showMapButtonColumn: true,
  showRouteFares: false,
  showViewTripButton: false,
  TimeColumnContent: PlaceRow.defaultProps.TimeColumnContent,
  timeOptions: null,
  toRouteAbbreviation: noop,
  TransitLegSubheader: undefined
};

export default ItineraryBody;

export { AccessibilityRating };
