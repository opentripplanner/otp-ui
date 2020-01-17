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
  routingType,
  setActiveLeg,
  setLegDiagram,
  setViewedTrip,
  showAgencyInfo,
  showElevationProfile,
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
  itinerary.legs.forEach((leg, i) => {
    // Create a row containing this leg's start place and leg traversal details
    rows.push(
      <PlaceRow
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        config={config}
        diagramVisible={diagramVisible}
        followsTransit={followsTransit}
        frameLeg={frameLeg}
        leg={leg}
        LegIcon={LegIcon}
        legIndex={i}
        place={leg.from}
        routingType={routingType}
        setActiveLeg={setActiveLeg}
        setLegDiagram={setLegDiagram}
        setViewedTrip={setViewedTrip}
        showAgencyInfo={showAgencyInfo}
        showElevationProfile={showElevationProfile}
        time={leg.startTime}
        timeOptions={timeOptions}
        toRouteAbbreviation={toRouteAbbreviation}
        TransitLegSummary={TransitLegSummary}
      />
    );
    // TODO: reconcile special props for lastrow
    // If this is the last leg, create a special PlaceRow for the destination only
    if (i === itinerary.legs.length - 1) {
      rows.push(
        <PlaceRow
          // eslint-disable-next-line react/no-array-index-key
          key={i + 1}
          config={config}
          diagramVisible={diagramVisible}
          frameLeg={frameLeg}
          LegIcon={LegIcon}
          place={leg.to}
          routingType={routingType}
          setActiveLeg={setActiveLeg}
          setLegDiagram={setLegDiagram}
          setViewedTrip={setViewedTrip}
          showAgencyInfo={showAgencyInfo}
          showElevationProfile={showElevationProfile}
          time={leg.endTime}
          timeOptions={timeOptions}
          toRouteAbbreviation={toRouteAbbreviation}
          TransitLegSummary={TransitLegSummary}
        />
      );
    }
    if (leg.transitLeg) followsTransit = true;
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
  frameLeg: PropTypes.func.isRequired,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: itineraryType.isRequired,
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: PropTypes.elementType.isRequired,
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
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: timeOptionsType,
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: PropTypes.func.isRequired,
  /**
   * An optional custom component for rendering the summary of a transit leg.
   * The component is sent 2 props:
   * - leg: the transit leg
   * - stopsExpanded: whether the intermediate stop display is currently expanded
   */
  TransitLegSummary: PropTypes.elementType
};

ItineraryBody.defaultProps = {
  className: null,
  diagramVisible: null,
  routingType: "ITINERARY",
  showAgencyInfo: false,
  showElevationProfile: false,
  timeOptions: null,
  TransitLegSummary: undefined
};

export default ItineraryBody;
