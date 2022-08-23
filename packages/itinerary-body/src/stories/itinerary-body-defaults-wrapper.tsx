// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import { TriMetLegIcon } from "@opentripplanner/icons";
import { Leg } from "@opentripplanner/types";
import React, { Component, ReactElement } from "react";
import { action } from "@storybook/addon-actions";

import ItineraryBody from "..";
import DefaultLineColumnContent from "../defaults/line-column-content";
import DefaultPlaceName from "../defaults/place-name";
import DefaultRouteDescription from "../defaults/route-description";
import DefaultTransitLegSummary from "../defaults/transit-leg-summary";
import { StyledItineraryBody } from "../demos";
import OtpRRStyledItineraryBody from "../otp-react-redux/itinerary-body";
import { ItineraryBodyProps } from "../types";

const config = require("../__mocks__/config.json");

type Props = ItineraryBodyProps & {
  styledItinerary?: string;
};

interface State {
  diagramVisible: Leg;
}

export default class ItineraryBodyDefaultsWrapper extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      diagramVisible: null
    };
  }

  setLegDiagram = (leg: Leg): void => {
    this.setState({ diagramVisible: leg });
  };

  render(): ReactElement {
    const {
      itinerary,
      LegIcon = TriMetLegIcon,
      LineColumnContent,
      PlaceName,
      RouteDescription,
      shouldAlwaysCollapseAlerts,
      showAgencyInfo,
      showLegIcon,
      showMapButtonColumn = true,
      showRouteFares,
      showViewTripButton,
      styledItinerary,
      TimeColumnContent,
      toRouteAbbreviation = r => r.toString().substr(0, 2),
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
        AlertBodyIcon={AlertBodyIcon}
        AlertToggleIcon={AlertToggleIcon}
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
        shouldAlwaysCollapseAlerts={shouldAlwaysCollapseAlerts}
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
      />
    );
  }
}
