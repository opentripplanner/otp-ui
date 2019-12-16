import { itineraryType, legType } from "@opentripplanner/core-utils/lib/types";
import React from "react";
import PropTypes from "prop-types";

import PlaceRow from "./place-row";
// import TripDetails from "./TripDetails";
// import TripTools from "./TripTools";
import * as Styled from "./styled";

const ItineraryBody = ({
  config,
  diagramVisible,
  itinerary,
  LegIcon,
  setActiveLeg,
  setLegDiagram,
  setViewedTrip,
  showElevationProfile,
  timeOptions,
  /*
    this triggers a rerender but is not consumed by children
  */
  // eslint-disable-next-line no-unused-vars
  companies,
  routingType,
  frameLeg,
  toRouteAbbreviation // ,
  // showTripDetails,
  // showTripTools
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
        showElevationProfile={showElevationProfile}
        time={leg.startTime}
        timeOptions={timeOptions}
        toRouteAbbreviation={toRouteAbbreviation}
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
          place={leg.to}
          routingType={routingType}
          setActiveLeg={setActiveLeg}
          setLegDiagram={setLegDiagram}
          showElevationProfile={showElevationProfile}
          time={leg.endTime}
          timeOptions={timeOptions}
          toRouteAbbreviation={toRouteAbbreviation}
        />
      );
    }
    if (leg.transitLeg) followsTransit = true;
  });
  return (
    <Styled.ItineraryBody>
      {rows}
      {/* TODO: Reincorporate these components as required by TORA project */}
      {/* showTripDetails && <TripDetails itinerary={itinerary} /> */}
      {/* showTripTools && <TripTools itinerary={itinerary} /> */}
    </Styled.ItineraryBody>
  );
};

ItineraryBody.propTypes = {
  /** Companies that the user has selected their trip options for their query */
  companies: PropTypes.string.isRequired,
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible: legType,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: itineraryType.isRequired,
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: PropTypes.elementType.isRequired,
  /** TODO: Routing Type is usually 'ITINERARY' but we should get more details on what this does */
  routingType: PropTypes.string,
  // New Props below
  /** Contains OTP configuration details. */
  config: PropTypes.shape({
    companies: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  /** Contains the preferred format string for time display -- may be able to get this from config */
  timeOptions: PropTypes.shape({}).isRequired,
  /** Sets the active leg */
  setActiveLeg: PropTypes.func.isRequired,
  /** Handler for when a leg diagram is selected. */
  setLegDiagram: PropTypes.func.isRequired,
  /** Fired when a user clicks on a view trip button of a transit leg */
  setViewedTrip: PropTypes.func.isRequired,
  /** If true, will show the elevation profile for walk/bike legs */
  showElevationProfile: PropTypes.bool,
  /** Frames a specific leg in an associated map view */
  frameLeg: PropTypes.func.isRequired,
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: PropTypes.func.isRequired // ,
  // showTripDetails: PropTypes.bool,
  // showTripTools: PropTypes.bool
};

ItineraryBody.defaultProps = {
  diagramVisible: null,
  routingType: "ITINERARY",
  showElevationProfile: false // ,
  // showTripDetails: true,
  // showTripTools: true
};

export default ItineraryBody;
