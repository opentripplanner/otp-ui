import { itineraryType, legType } from "@opentripplanner/core-utils/lib/types";
import TriMetLegIcon from "@opentripplanner/icons/lib/trimet-leg-icon";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import ItineraryBody from ".";
import * as ItineraryBodyClasses from "./styled";

const config = require("./__mocks__/config.json");

// import mock itinaries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("./__mocks__/itineraries/bike-only.json");
const bikeRentalItinerary = require("./__mocks__/itineraries/bike-rental.json");
const bikeRentalTransitBikeRentalItinerary = require("./__mocks__/itineraries/bike-rental-transit-bike-rental.json");
const bikeTransitBikeItinerary = require("./__mocks__/itineraries/bike-transit-bike.json");
const eScooterRentalItinerary = require("./__mocks__/itineraries/e-scooter-rental.json");
const eScooterRentalTransiteScooterRentalItinerary = require("./__mocks__/itineraries/e-scooter-transit-e-scooter.json");
const parkAndRideItinerary = require("./__mocks__/itineraries/park-and-ride.json");
const tncTransitTncItinerary = require("./__mocks__/itineraries/tnc-transit-tnc.json");
const walkInterlinedTransitItinerary = require("./__mocks__/itineraries/walk-interlined-transit-walk.json");
const walkOnlyItinerary = require("./__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("./__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkTransitWalkItinerary = require("./__mocks__/itineraries/walk-transit-walk-transit-walk.json");

const StyledItineraryBody = styled(ItineraryBody)`
  ${ItineraryBodyClasses.LegBody} {
    background-color: pink;
  }
`;

const OtpRRStyledItineraryBody = styled(ItineraryBody)`
  ${ItineraryBodyClasses.LegDescriptionRouteShortName} {
    background-color: rgb(15, 106, 172);
    border-color: white;
    border-image: initial;
    border-radius: 12px;
    border-style: solid;
    border-width: 1px;
    box-shadow: rgb(0, 0, 0) 0px 0px 0.25em;
    color: white;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    height: 21px;
    margin-right: 8px;
    padding-top: 2px;
    text-align: center;
    width: 24px;
  }
`;

class ItineraryBodyDefaultsWrapper extends Component {
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
      PlaceName,
      RouteDescription,
      showAgencyInfo,
      TransitLegSummary,
      styledItinerary
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
        LegIcon={TriMetLegIcon}
        PlaceName={PlaceName}
        RouteDescription={RouteDescription}
        routingType="ITINERARY"
        setActiveLeg={action("setActiveLeg")}
        setLegDiagram={this.setLegDiagram}
        setViewedTrip={action("setViewedTrip")}
        showAgencyInfo={showAgencyInfo}
        showElevationProfile
        toRouteAbbreviation={r => r.toString().substr(0, 2)}
        TransitLegSummary={TransitLegSummary}
      />
    );
  }
}

ItineraryBodyDefaultsWrapper.propTypes = {
  itinerary: itineraryType.isRequired,
  PlaceName: PropTypes.elementType,
  RouteDescription: PropTypes.elementType,
  showAgencyInfo: PropTypes.bool,
  TransitLegSummary: PropTypes.elementType,
  styledItinerary: PropTypes.string
};

ItineraryBodyDefaultsWrapper.defaultProps = {
  showAgencyInfo: false,
  PlaceName: undefined,
  RouteDescription: undefined,
  TransitLegSummary: undefined,
  styledItinerary: null
};

function CustomPlaceName({ place }) {
  return `🎉✨🎊 ${place.name} 🎉✨🎊`;
}

function CustomTransitLegSummary({ leg }) {
  if (leg.duration) {
    return `It'll probably take around ${leg.duration} seconds.`;
  }
}

CustomTransitLegSummary.propTypes = {
  leg: legType.isRequired
};

const TriMetLegIconContainer = styled.div`
  float: left;
  height: 24px;
  margin-right: 6px;
  width: 24px;
`;

function OtpRRRouteDescription({ leg }) {
  const { headsign, routeLongName, routeShortName } = leg;
  return (
    <ItineraryBodyClasses.LegDescriptionForTransit>
      <TriMetLegIconContainer>
        <TriMetLegIcon leg={leg} />
      </TriMetLegIconContainer>
      {routeShortName && (
        <div>
          <ItineraryBodyClasses.LegDescriptionRouteShortName>
            {routeShortName}
          </ItineraryBodyClasses.LegDescriptionRouteShortName>
        </div>
      )}
      <ItineraryBodyClasses.LegDescriptionRouteLongName>
        {routeLongName}
        {headsign && (
          <span>
            {" "}
            <ItineraryBodyClasses.LegDescriptionHeadsignPrefix>
              to
            </ItineraryBodyClasses.LegDescriptionHeadsignPrefix>{" "}
            {headsign}
          </span>
        )}
      </ItineraryBodyClasses.LegDescriptionRouteLongName>
    </ItineraryBodyClasses.LegDescriptionForTransit>
  );
}

OtpRRRouteDescription.propTypes = {
  leg: legType.isRequired
};

storiesOf("ItineraryBody", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ItineraryBody with walk-only itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={walkOnlyItinerary} />
  ))
  .add("ItineraryBody with bike-only itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={bikeOnlyItinerary} />
  ))
  .add("ItineraryBody with walk-transit-walk itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={walkTransitWalkItinerary} />
  ))
  .add("Styled ItineraryBody with walk-transit-walk itinerary", () => (
    <ItineraryBodyDefaultsWrapper
      itinerary={walkTransitWalkItinerary}
      styledItinerary="pink-legs"
    />
  ))
  .add(
    "ItineraryBody with walk-transit-walk itinerary with agency information",
    () => (
      <ItineraryBodyDefaultsWrapper
        itinerary={walkTransitWalkItinerary}
        showAgencyInfo
      />
    )
  )
  .add(
    "ItineraryBody with walk-transit-walk itinerary with custom transit leg summary component",
    () => (
      <ItineraryBodyDefaultsWrapper
        itinerary={walkTransitWalkItinerary}
        TransitLegSummary={CustomTransitLegSummary}
      />
    )
  )
  .add(
    "ItineraryBody with walk-transit-walk itinerary with custom place name component",
    () => (
      <ItineraryBodyDefaultsWrapper
        itinerary={walkTransitWalkItinerary}
        PlaceName={CustomPlaceName}
      />
    )
  )
  .add("ItineraryBody with bike-transit-bike itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={bikeTransitBikeItinerary} />
  ))
  .add("ItineraryBody with walk-interlined-transit itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={walkInterlinedTransitItinerary} />
  ))
  .add("ItineraryBody with walk-transit-transfer itinerary", () => (
    <ItineraryBodyDefaultsWrapper
      itinerary={walkTransitWalkTransitWalkItinerary}
    />
  ))
  .add("ItineraryBody with bike-rental itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={bikeRentalItinerary} />
  ))
  .add("ItineraryBody with E-scooter-rental itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={eScooterRentalItinerary} />
  ))
  .add("ItineraryBody with park and ride itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={parkAndRideItinerary} />
  ))
  .add("ItineraryBody with bike rental + transit itinerary", () => (
    <ItineraryBodyDefaultsWrapper
      itinerary={bikeRentalTransitBikeRentalItinerary}
    />
  ))
  .add("ItineraryBody with E-scooter rental + transit itinerary", () => (
    <ItineraryBodyDefaultsWrapper
      itinerary={eScooterRentalTransiteScooterRentalItinerary}
    />
  ))
  .add(
    "ItineraryBody with E-scooter rental + transit itinerary with OTP-RR styling and customizations",
    () => (
      <ItineraryBodyDefaultsWrapper
        itinerary={eScooterRentalTransiteScooterRentalItinerary}
        RouteDescription={OtpRRRouteDescription}
        styledItinerary="otp-rr"
      />
    )
  )
  .add("ItineraryBody with TNC + transit itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={tncTransitTncItinerary} />
  ));
