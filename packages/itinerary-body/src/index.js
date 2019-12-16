import React from "react";
import PropTypes from "prop-types";

import PlaceRow from "./place-row";
// import TripDetails from "./TripDetails";
// import TripTools from "./TripTools";
import * as Styled from "./styled";

const ItineraryBody = ({
  config,
  itinerary,
  LegIcon,
  setActiveLeg,
  setViewedTrip,
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
        place={leg.from}
        time={leg.startTime}
        leg={leg}
        LegIcon={LegIcon}
        legIndex={i}
        followsTransit={followsTransit}
        timeOptions={timeOptions}
        setActiveLeg={setActiveLeg}
        setViewedTrip={setViewedTrip}
        routingType={routingType}
        frameLeg={frameLeg}
        toRouteAbbreviation={toRouteAbbreviation}
        config={config}
      />
    );
    // TODO: reconcile special props for lastrow
    // If this is the last leg, create a special PlaceRow for the destination only
    if (i === itinerary.legs.length - 1) {
      rows.push(
        <PlaceRow
          config={config}
          place={leg.to}
          time={leg.endTime}
          timeOptions={timeOptions}
          setActiveLeg={setActiveLeg}
          toRouteAbbreviation={toRouteAbbreviation}
          // eslint-disable-next-line react/no-array-index-key
          key={i + 1}
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
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: PropTypes.shape({
    legs: PropTypes.arrayOf(
      PropTypes.shape({
        transitLeg: PropTypes.bool.isRequired
      }).isRequired
    ).isRequired
  }).isRequired,
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
  /** Fired when a user clicks on a view trip button of a transit leg */
  setViewedTrip: PropTypes.func.isRequired,
  /** Frames a specific leg in an associated map view */
  frameLeg: PropTypes.func.isRequired,
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: PropTypes.func.isRequired // ,
  // showTripDetails: PropTypes.bool,
  // showTripTools: PropTypes.bool
};

ItineraryBody.defaultProps = {
  routingType: "ITINERARY" // ,
  // showTripDetails: true,
  // showTripTools: true
};

export default ItineraryBody;
