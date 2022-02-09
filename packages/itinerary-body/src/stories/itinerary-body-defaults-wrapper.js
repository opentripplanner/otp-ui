import coreUtils from "@opentripplanner/core-utils";
import { TriMetLegIcon } from "@opentripplanner/icons";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { action } from "@storybook/addon-actions";

import ItineraryBody from "..";
import DefaultLineColumnContent from "../defaults/line-column-content";
import DefaultPlaceName from "../defaults/place-name";
import DefaultRouteDescription from "../defaults/route-description";
import DefaultTransitLegSummary from "../defaults/transit-leg-summary";
import { StyledItineraryBody } from "../demos";
import OtpRRStyledItineraryBody from "../otp-react-redux/itinerary-body";

const config = require("../__mocks__/config.json");

export default class ItineraryBodyDefaultsWrapper extends Component {
  constructor() {
    super();
    this.state = {};
  }

  setLegDiagram = leg => {
    this.setState({ diagramVisible: leg });
  };

  render() {
    const {
      itinerary,
      LegIcon,
      LineColumnContent,
      PlaceName,
      RouteDescription,
      showAgencyInfo,
      showLegIcon,
      showMapButtonColumn,
      showRouteFares,
      showViewTripButton,
      styledItinerary,
      TimeColumnContent,
      toRouteAbbreviation,
      TransitLegSubheader,
      TransitLegSummary,
      AlertToggleIcon,
      AlertBodyIcon
    } = this.props;
    const { diagramVisible } = this.state;
    let ItineraryBodyComponent;
    switch (styledItinerary) {
      case "pink-legs":
        ItineraryBodyComponent = StyledItineraryBody;
        break;
      case "otp-rr":
        ItineraryBodyComponent = OtpRRStyledItineraryBody;
        break;
      default:
        ItineraryBodyComponent = ItineraryBody;
    }
    return (
      <ItineraryBodyComponent
        config={config}
        diagramVisible={diagramVisible}
        frameLeg={action("frameLeg")}
        itinerary={itinerary}
        LegIcon={LegIcon}
        LineColumnContent={LineColumnContent || DefaultLineColumnContent}
        mapillaryKey="fake key, but ok because the api response is also fake"
        PlaceName={PlaceName || DefaultPlaceName}
        RouteDescription={RouteDescription || DefaultRouteDescription}
        routingType="ITINERARY"
        setActiveLeg={action("setActiveLeg")}
        setLegDiagram={this.setLegDiagram}
        setViewedTrip={action("setViewedTrip")}
        showAgencyInfo={showAgencyInfo}
        showElevationProfile
        showLegIcon={showLegIcon}
        showMapButtonColumn={showMapButtonColumn}
        showRouteFares={showRouteFares}
        showViewTripButton={showViewTripButton}
        TimeColumnContent={TimeColumnContent}
        toRouteAbbreviation={toRouteAbbreviation}
        TransitLegSubheader={TransitLegSubheader}
        TransitLegSummary={TransitLegSummary || DefaultTransitLegSummary}
        AlertToggleIcon={AlertToggleIcon}
        AlertBodyIcon={AlertBodyIcon}
      />
    );
  }
}

ItineraryBodyDefaultsWrapper.propTypes = {
  itinerary: coreUtils.types.itineraryType.isRequired,
  LegIcon: PropTypes.elementType,
  LineColumnContent: PropTypes.elementType,
  PlaceName: PropTypes.elementType,
  RouteDescription: PropTypes.elementType,
  showAgencyInfo: PropTypes.bool,
  showLegIcon: PropTypes.bool,
  showMapButtonColumn: PropTypes.bool,
  showRouteFares: PropTypes.bool,
  showViewTripButton: PropTypes.bool,
  styledItinerary: PropTypes.string,
  TimeColumnContent: PropTypes.elementType,
  toRouteAbbreviation: PropTypes.func,
  TransitLegSubheader: PropTypes.elementType,
  TransitLegSummary: PropTypes.elementType,
  AlertToggleIcon: PropTypes.elementType,
  AlertBodyIcon: PropTypes.elementType
};

ItineraryBodyDefaultsWrapper.defaultProps = {
  LegIcon: TriMetLegIcon,
  LineColumnContent: undefined,
  PlaceName: undefined,
  RouteDescription: undefined,
  showAgencyInfo: false,
  showLegIcon: false,
  showMapButtonColumn: true,
  showRouteFares: false,
  showViewTripButton: false,
  styledItinerary: null,
  TimeColumnContent: undefined,
  toRouteAbbreviation: r => r.toString().substr(0, 2),
  TransitLegSubheader: undefined,
  TransitLegSummary: undefined,
  AlertToggleIcon: undefined,
  AlertBodyIcon: undefined
};
