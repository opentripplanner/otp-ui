import React from "react";
import PropTypes from "prop-types";

import { formatTime } from "@opentripplanner/core-utils/lib/time";
import { getPlaceName } from "@opentripplanner/core-utils/lib/itinerary";
import { configType, legType } from "@opentripplanner/core-utils/lib/types";
import LocationIcon from "@opentripplanner/location-icon";

import * as Styled from "./styled";
import AccessLegBody from "./AccessLegBody";
import TransitLegBody from "./TransitLegBody";
import RouteBadge from "./RouteBadge";

/** Looks up an operator from the provided configuration */
const getOperatorFromConfig = (id, config) =>
  config.operators.find(operator => operator.id === id) || null;

/*
  TODO: Wondering if it's possible for us to destructure the time
  preferences from the config object and avoid making the props list so long
*/
const PlaceRow = ({
  config,
  diagramVisible,
  followsTransit,
  frameLeg,
  leg,
  LegIcon,
  legIndex,
  place,
  routingType,
  setActiveLeg,
  setLegDiagram,
  setViewedTrip,
  showElevationProfile,
  time,
  timeOptions,
  toRouteAbbreviation
}) => {
  // NOTE: Previously there was a check for itineraries that changed vehicles
  // at a single stop, which would render the stop place the same as the
  // interline stop. However, this prevents the user from being able to click
  // on the stop viewer in this case, which they may want to do in order to
  // check the real-time arrival information for the next leg of their journey.
  const interline = leg && leg.interlineWithPreviousLeg;
  const hideBorder = interline || !legIndex;
  const { longDateFormat, timeFormat } = config.dateTime;
  return (
    // TODO: I think it should be OK to use leg index here
    <Styled.PlaceRowWrapper key={legIndex}>
      <Styled.TimeColumn>
        {time && formatTime(time, timeOptions)}
      </Styled.TimeColumn>
      <Styled.LineColumn>
        <Styled.LegLine>
          {leg && (
            <Styled.InnerLine mode={leg.mode} routeColor={leg.routeColor} />
          )}
          <Styled.LineBadgeContainer>
            {/* TODO: This is a placeholder for a routebadge when we create the transit leg */}
            {!interline && leg && leg.transitLeg && (
              <RouteBadge
                color={leg.routeColor}
                abbreviation={toRouteAbbreviation(
                  parseInt(leg.route, 10) || leg.route
                )}
                name={leg.routeLongName || ""}
              />
            )}
            {!interline && leg && !leg.transitLeg && (
              <Styled.AccessBadge mode={leg.mode} routeColor={leg.routeColor}>
                {
                  <LegIcon
                    leg={leg}
                    title={`Travel by ${leg.mode}`}
                    width="66%"
                  />
                }
              </Styled.AccessBadge>
            )}
            {!leg && (
              <Styled.Destination>
                <LocationIcon size={25} type="to" />
              </Styled.Destination>
            )}
          </Styled.LineBadgeContainer>
        </Styled.LegLine>
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
              {interline ? (
                <>
                  Stay on Board at <b>{place.name}</b>
                </>
              ) : (
                <>{getPlaceName(place, config.companies)}</>
              )}
              {/* TODO: take another pass on this when working the Transit Leg */}
              {/* Place subheading: Transit stop */}
              {place.stopId && !interline && (
                <Styled.StopIdSpan>
                  ID {place.stopId.split(":")[1]}
                </Styled.StopIdSpan>
                /*
                TODO: There is no explicit stop button on the mocks.
                Have a question out to marketing as to whether the above StopID
                is a button to navigate the user to the arrival list for the stop
                Thats what the button below does
              */
                /* <ViewStopButton stopId={place.stopId} /> */
              )}
            </Styled.PlaceName>
          </Styled.PlaceHeader>

          {/* Place subheading: rented vehicle (e.g., scooter, bike, car) pickup */}
          {leg && (leg.rentedVehicle || leg.rentedBike || leg.rentedCar) && (
            <div>TODO: Rented vehicle leg</div>
            // <RentedVehicleLeg config={config} leg={leg} />
          )}
          {/* Show the leg, if present */}
          {leg &&
            (leg.transitLeg ? (
              /* This is a transit leg */
              <TransitLegBody
                leg={leg}
                legIndex={legIndex}
                setActiveLeg={setActiveLeg}
                longDateFormat={longDateFormat}
                operator={
                  leg.agencyId && getOperatorFromConfig(leg.agencyId, config)
                }
                setViewedTrip={setViewedTrip}
                timeFormat={timeFormat}
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
                timeOptions={timeOptions}
              />
            ))}
        </Styled.PlaceDetails>
      </Styled.DetailsColumn>
      <Styled.MapButtonColumn hideBorder={hideBorder.toString()}>
        <Styled.MapButton onClick={frameLeg}>
          <Styled.MapIcon />
        </Styled.MapButton>
      </Styled.MapButtonColumn>
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
  followsTransit: PropTypes.bool.isRequired,
  /** Frames a specific leg in an associated map view */
  frameLeg: PropTypes.func.isRequired,
  /** Contains details about leg object that is being displayed */
  leg: legType,
  /** A component class used to render the icon for a leg */
  LegIcon: PropTypes.elementType.isRequired,
  /** The index value of this specific leg within the itinerary */
  legIndex: PropTypes.number.isRequired,
  /** Contains details about the place being featured in this block */
  place: PropTypes.shape({
    stopId: PropTypes.string,
    name: PropTypes.string.isRequired
  }).isRequired,
  /** TODO: Routing Type is usually 'ITINERARY' but we should get more details on what this does */
  routingType: PropTypes.string.isRequired,
  /** Sets the active leg */
  setActiveLeg: PropTypes.func.isRequired,
  /** Fired when a user clicks on a view trip button of a transit leg */
  setViewedTrip: PropTypes.func.isRequired,
  /** If true, will show the elevation profile for walk/bike legs */
  showElevationProfile: PropTypes.bool,
  /** Handler for when a leg diagram is selected. */
  setLegDiagram: PropTypes.func.isRequired,
  /** A unit timestamp of the time being featured in this block */
  time: PropTypes.number.isRequired,
  /** Contains the preferred format string for time display -- may be able to get this from config */
  timeOptions: PropTypes.shape({}).isRequired,
  /** Converts a route's ID to its accepted badge abbreviation */
  toRouteAbbreviation: PropTypes.func.isRequired
};

PlaceRow.defaultProps = {
  diagramVisible: null,
  leg: null,
  showElevationProfile: false
};

export default PlaceRow;
