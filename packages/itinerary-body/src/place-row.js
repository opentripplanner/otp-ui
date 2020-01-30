import React from "react";
import PropTypes from "prop-types";

import { formatTime } from "@opentripplanner/core-utils/lib/time";
import {
  getCompaniesLabelFromNetworks,
  getModeForPlace,
  getPlaceName
} from "@opentripplanner/core-utils/lib/itinerary";
import {
  configType,
  legType,
  placeType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import LocationIcon from "@opentripplanner/location-icon";

import * as Styled from "./styled";
import AccessLegBody from "./AccessLegBody";
import TransitLegBody from "./TransitLegBody";
import RouteBadge from "./RouteBadge";

/** Looks up an operator from the provided configuration */
const getTransitOperatorFromConfig = (id, config) =>
  config.transitOperators.find(transitOperator => transitOperator.id === id) ||
  null;

function DefaultPlaceName({ config, interline, place }) {
  return (
    <>
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
        <Styled.StopIdSpan>ID {place.stopId.split(":")[1]}</Styled.StopIdSpan>
        /*
        TODO: There is no explicit stop button on the mocks.
        Have a question out to marketing as to whether the above StopID
        is a button to navigate the user to the arrival list for the stop
        Thats what the button below does
      */
        /* <ViewStopButton stopId={place.stopId} /> */
      )}
    </>
  );
}

DefaultPlaceName.propTypes = {
  config: configType.isRequired,
  interline: PropTypes.bool,
  place: placeType.isRequired
};

DefaultPlaceName.defaultProps = {
  interline: false
};

/**
 * A component to display vehicle rental data. The word "Vehicle" has been used
 * because a future refactor is intended to combine car rental, bike rental
 * and micromobility rental all within this component. The future refactor is
 * assuming that the leg.rentedCar and leg.rentedBike response elements from OTP
 * will eventually be merged into the leg.rentedVehicle element.
 */
function RentedVehicleLeg({ config, leg }) {
  const configCompanies = config.companies || [];

  // Sometimes rented vehicles can be walked over things like stairs or other
  // ways that forbid the main mode of travel.
  if (leg.mode === "WALK") {
    return (
      <Styled.PlaceSubheader>
        Walk vehicle along {leg.from.name}
      </Styled.PlaceSubheader>
    );
  }

  let rentalDescription = "Pick up";
  if (leg.rentedBike) {
    // TODO: Special case for TriMet may need to be refactored.
    rentalDescription += ` shared bike`;
  } else {
    // Add company and vehicle labels.
    let vehicleName = "";
    // TODO allow more flexibility in customizing these mode strings
    let modeString = leg.rentedVehicle
      ? "E-scooter"
      : leg.rentedBike
      ? "bike"
      : "car";

    // The networks attribute of the from data will only appear at the very
    // beginning of the rental. It is possible that there will be some forced
    // walking that occurs in the middle of the rental, so once the main mode
    // resumes there won't be any network info. In that case we simply return
    // that the rental is continuing.
    if (leg.from.networks) {
      const companiesLabel = getCompaniesLabelFromNetworks(
        leg.from.networks,
        configCompanies
      );
      rentalDescription += ` ${companiesLabel}`;
      // Only show vehicle name for car rentals. For bikes and E-scooters, these
      // IDs/names tend to be less relevant (or entirely useless) in this context.
      if (leg.rentedCar && leg.from.name) {
        vehicleName = leg.from.name;
      }
      modeString = getModeForPlace(leg.from);
    } else {
      rentalDescription = "Continue using rental";
    }

    rentalDescription += ` ${modeString} ${vehicleName}`;
  }
  // e.g., Pick up REACHNOW rented car XYZNDB OR
  //       Pick up SPIN E-scooter
  //       Pick up shared bike
  return <Styled.PlaceSubheader>{rentalDescription}</Styled.PlaceSubheader>;
}

RentedVehicleLeg.propTypes = {
  config: configType.isRequired,
  leg: legType.isRequired
};

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
  PlaceName,
  RouteDescription,
  routingType,
  setActiveLeg,
  setLegDiagram,
  setViewedTrip,
  showAgencyInfo,
  showElevationProfile,
  time,
  timeOptions,
  toRouteAbbreviation,
  TransitLegSummary
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
    <Styled.PlaceRowWrapper key={legIndex || "destination-place"}>
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
              <PlaceName config={config} interline={interline} place={place} />
            </Styled.PlaceName>
          </Styled.PlaceHeader>

          {/* Place subheading: rented vehicle (e.g., scooter, bike, car) pickup */}
          {leg && (leg.rentedVehicle || leg.rentedBike || leg.rentedCar) && (
            <RentedVehicleLeg config={config} leg={leg} />
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
                RouteDescription={RouteDescription}
                setViewedTrip={setViewedTrip}
                showAgencyInfo={showAgencyInfo}
                timeFormat={timeFormat}
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
  followsTransit: PropTypes.bool,
  /** Called upon clicking the map icon. Called with an argument of the click event. */
  frameLeg: PropTypes.func.isRequired,
  /** Contains details about leg object that is being displayed */
  leg: legType,
  /** A component class used to render the icon for a leg */
  LegIcon: PropTypes.elementType.isRequired,
  /** The index value of this specific leg within the itinerary */
  legIndex: PropTypes.number,
  /** Contains details about the place being featured in this block */
  place: PropTypes.shape({
    stopId: PropTypes.string,
    name: PropTypes.string.isRequired
  }).isRequired,
  /**
   * An optional custom component for rendering the place name of legs.
   * The component is sent 3 props:
   * - config: the application config
   * - interline: whether this place is an interlined stop (a stop where a
   *   transit vehicle changes routes, but a rider can continue riding without
   *   deboarding)
   * - place: the particular place. Typically this is the from place, but it
   *   could also be the to place if it is the destination of the itinerary.
   */
  PlaceName: PropTypes.elementType,
  /**
   * An optional component to render the name of a route.
   *
   * The component is sent 2 props:
   * - leg: the itinerary leg with the transit information
   * - transitOperator: the transit operator associated with the route if available
   */
  RouteDescription: PropTypes.elementType,
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
  showAgencyInfo: PropTypes.bool,
  /** If true, will show the elevation profile for walk/bike legs */
  showElevationProfile: PropTypes.bool,
  /** Handler for when a leg diagram is selected. */
  setLegDiagram: PropTypes.func.isRequired,
  /** A unit timestamp of the time being featured in this block */
  time: PropTypes.number.isRequired,
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

PlaceRow.defaultProps = {
  diagramVisible: null,
  followsTransit: false,
  // can be null if this is the destination place
  leg: null,
  // can be null if this is the destination place
  legIndex: null,
  PlaceName: DefaultPlaceName,
  RouteDescription: undefined,
  showAgencyInfo: false,
  showElevationProfile: false,
  timeOptions: null,
  TransitLegSummary: undefined
};

export default PlaceRow;
