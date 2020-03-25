import {
  itineraryType,
  languageConfigType,
  legType
} from "@opentripplanner/core-utils/lib/types";
import TriMetLegIcon from "@opentripplanner/icons/lib/trimet-leg-icon";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import ItineraryBody from ".";
import DefaultLineColumnContent from "./defaults/line-column-content";
import DefaultPlaceName from "./defaults/place-name";
import DefaultRouteDescription from "./defaults/route-description";
import DefaultTransitLegSummary from "./defaults/transit-leg-summary";
import OtpRRStyledItineraryBody from "./otp-react-redux/itinerary-body";
import OtpRRLineColumnContent from "./otp-react-redux/line-column-content";
import OtpRRPlaceName from "./otp-react-redux/place-name";
import OtpRRRouteDescription from "./otp-react-redux/route-description";
import OtpRRTransitLegSubheader from "./otp-react-redux/transit-leg-subheader";
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
      LineColumnContent,
      PlaceName,
      RouteDescription,
      showAgencyInfo,
      showLegIcon,
      showMapButtonColumn,
      styledItinerary,
      TransitLegSubheader,
      TransitLegSummary
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
        LineColumnContent={LineColumnContent || DefaultLineColumnContent}
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
        toRouteAbbreviation={r => r.toString().substr(0, 2)}
        TransitLegSubheader={TransitLegSubheader}
        TransitLegSummary={TransitLegSummary || DefaultTransitLegSummary}
      />
    );
  }
}

ItineraryBodyDefaultsWrapper.propTypes = {
  itinerary: itineraryType.isRequired,
  LineColumnContent: PropTypes.elementType,
  PlaceName: PropTypes.elementType,
  RouteDescription: PropTypes.elementType,
  showAgencyInfo: PropTypes.bool,
  showLegIcon: PropTypes.bool,
  showMapButtonColumn: PropTypes.bool,
  styledItinerary: PropTypes.string,
  TransitLegSubheader: PropTypes.elementType,
  TransitLegSummary: PropTypes.elementType
};

ItineraryBodyDefaultsWrapper.defaultProps = {
  LineColumnContent: undefined,
  PlaceName: undefined,
  RouteDescription: undefined,
  showAgencyInfo: false,
  showLegIcon: false,
  showMapButtonColumn: true,
  styledItinerary: null,
  TransitLegSubheader: undefined,
  TransitLegSummary: undefined
};

function WrappedOtpRRTransitLegSubheader({ languageConfig, leg }) {
  return (
    <OtpRRTransitLegSubheader
      languageConfig={languageConfig}
      leg={leg}
      onStopClick={action("Transit Stop Click")}
    />
  );
}

WrappedOtpRRTransitLegSubheader.propTypes = {
  languageConfig: languageConfigType.isRequired,
  leg: legType.isRequired
};

function OtpRRItineraryBodyWrapper({ itinerary }) {
  return (
    <ItineraryBodyDefaultsWrapper
      itinerary={itinerary}
      LineColumnContent={OtpRRLineColumnContent}
      PlaceName={OtpRRPlaceName}
      RouteDescription={OtpRRRouteDescription}
      showAgencyInfo
      showLegIcon
      showMapButtonColumn={false}
      styledItinerary="otp-rr"
      TransitLegSubheader={WrappedOtpRRTransitLegSubheader}
    />
  );
}

OtpRRItineraryBodyWrapper.propTypes = {
  itinerary: itineraryType.isRequired
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
  .add("ItineraryBody with TNC + transit itinerary", () => (
    <ItineraryBodyDefaultsWrapper itinerary={tncTransitTncItinerary} />
  ))
  .add(
    "ItineraryBody with walk-only itinerary  with OTP-RR styling and customizations",
    () => <OtpRRItineraryBodyWrapper itinerary={walkOnlyItinerary} />
  )
  .add(
    "ItineraryBody with bike-only itinerary  with OTP-RR styling and customizations",
    () => <OtpRRItineraryBodyWrapper itinerary={bikeOnlyItinerary} />
  )
  .add(
    "ItineraryBody with walk-transit-walk itinerary  with OTP-RR styling and customizations",
    () => <OtpRRItineraryBodyWrapper itinerary={walkTransitWalkItinerary} />
  )
  .add(
    "ItineraryBody with bike-transit-bike itinerary  with OTP-RR styling and customizations",
    () => <OtpRRItineraryBodyWrapper itinerary={bikeTransitBikeItinerary} />
  )
  .add(
    "ItineraryBody with walk-interlined-transit itinerary  with OTP-RR styling and customizations",
    () => (
      <OtpRRItineraryBodyWrapper itinerary={walkInterlinedTransitItinerary} />
    )
  )
  .add(
    "ItineraryBody with walk-transit-transfer itinerary  with OTP-RR styling and customizations",
    () => (
      <OtpRRItineraryBodyWrapper
        itinerary={walkTransitWalkTransitWalkItinerary}
      />
    )
  )
  .add(
    "ItineraryBody with bike-rental itinerary with OTP-RR styling and customizations",
    () => <OtpRRItineraryBodyWrapper itinerary={bikeRentalItinerary} />
  )
  .add(
    "ItineraryBody with E-scooter-rental itinerary with OTP-RR styling and customizations",
    () => <OtpRRItineraryBodyWrapper itinerary={eScooterRentalItinerary} />
  )
  .add(
    "ItineraryBody with park and ride itinerary with OTP-RR styling and customizations",
    () => <OtpRRItineraryBodyWrapper itinerary={parkAndRideItinerary} />
  )
  .add(
    "ItineraryBody with bike rental + transit itinerary with OTP-RR styling and customizations",
    () => (
      <OtpRRItineraryBodyWrapper
        itinerary={bikeRentalTransitBikeRentalItinerary}
      />
    )
  )
  .add(
    "ItineraryBody with E-scooter rental + transit itinerary with OTP-RR styling and customizations",
    () => (
      <OtpRRItineraryBodyWrapper
        itinerary={eScooterRentalTransiteScooterRentalItinerary}
      />
    )
  )
  .add(
    "ItineraryBody with TNC + transit itinerary with OTP-RR styling and customizations",
    () => <OtpRRItineraryBodyWrapper itinerary={tncTransitTncItinerary} />
  );
