import React, { ReactElement } from "react";

import AccessibilityRating from "./accessibility-rating";
import PlaceRow from "./place-row";
import * as S from "../styled";
import { ItineraryBodyProps } from "../types";

function noop() {}

function defaultRouteAbbr(arg: string | number): string {
  return arg.toString();
}

const ItineraryBody = ({
  accessibilityScoreGradationMap,
  AlertBodyIcon,
  AlertToggleIcon,
  alwaysCollapseAlerts = false,
  className,
  config,
  defaultFareSelector,
  diagramVisible,
  frameLeg = noop,
  itinerary,
  LegIcon,
  LineColumnContent,
  mapillaryCallback,
  mapillaryKey,
  PlaceName,
  RouteDescription,
  RouteDescriptionFooter,
  routingType = "ITINERARY",
  setActiveLeg,
  setLegDiagram,
  setViewedTrip,
  showApproximatePrefixAccessLegs,
  showAgencyInfo,
  showElevationProfile,
  showLegIcon,
  showMapButtonColumn = true,
  showViewTripButton,
  TimeColumnContent,
  toRouteAbbreviation = defaultRouteAbbr,
  TransitLegSubheader,
  TransitLegSummary
}: ItineraryBodyProps): ReactElement => {
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
          accessibilityScoreGradationMap={accessibilityScoreGradationMap}
          AlertToggleIcon={AlertToggleIcon}
          AlertBodyIcon={AlertBodyIcon}
          alwaysCollapseAlerts={alwaysCollapseAlerts}
          // eslint-disable-next-line react/no-array-index-key
          key={i + (isDestination ? 1 : 0)}
          config={config}
          defaultFareSelector={defaultFareSelector}
          diagramVisible={diagramVisible}
          followsTransit={followsTransit}
          frameLeg={frameLeg}
          isDestination={isDestination}
          lastLeg={lastLeg}
          leg={leg}
          LegIcon={LegIcon}
          legIndex={i}
          LineColumnContent={LineColumnContent}
          mapillaryCallback={mapillaryCallback}
          mapillaryKey={mapillaryKey}
          PlaceName={PlaceName}
          RouteDescription={RouteDescription}
          RouteDescriptionFooter={RouteDescriptionFooter}
          routingType={routingType}
          setActiveLeg={setActiveLeg}
          setLegDiagram={setLegDiagram}
          setViewedTrip={setViewedTrip}
          showApproximatePrefixAccessLegs={showApproximatePrefixAccessLegs}
          showAgencyInfo={showAgencyInfo}
          showElevationProfile={showElevationProfile}
          showLegIcon={showLegIcon}
          showMapButtonColumn={showMapButtonColumn}
          showViewTripButton={showViewTripButton}
          TimeColumnContent={TimeColumnContent}
          toRouteAbbreviation={toRouteAbbreviation}
          TransitLegSubheader={TransitLegSubheader}
          TransitLegSummary={TransitLegSummary}
        />
      );
    }

    createPlaceRow(false);
    // If this is the last leg, create a special PlaceRow for the destination only.
    if (i === itinerary.legs.length - 1) {
      createPlaceRow(true);
    }
    if (leg.transitLeg) followsTransit = true;
    lastLeg = leg;
  });
  return <S.ItineraryBody className={className}>{rows}</S.ItineraryBody>;
};

export default ItineraryBody;

export { AccessibilityRating };
