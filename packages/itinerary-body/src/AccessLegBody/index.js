import coreUtils from "@opentripplanner/core-utils";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { VelocityTransitionGroup } from "velocity-react";

import AccessLegSteps from "./access-leg-steps";
import AccessLegSummary from "./access-leg-summary";
import LegDiagramPreview from "./leg-diagram-preview";
import RentedVehicleSubheader from "./rented-vehicle-subheader";
import * as Styled from "../styled";
import TNCLeg from "./tnc-leg";

/**
 * Component for access (e.g. walk/bike/etc.) leg in narrative itinerary. This
 * particular component is used in the line-itin (i.e., trimet-mod-otp) version
 * of the narrative itinerary.
 */
class AccessLegBody extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  onStepsHeaderClick = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  onSummaryClick = () => {
    const { leg, legIndex, setActiveLeg } = this.props;
    setActiveLeg(legIndex, leg);
  };

  render() {
    const {
      config,
      diagramVisible,
      followsTransit,
      leg,
      LegIcon,
      setLegDiagram,
      showElevationProfile,
      showLegIcon,
      timeOptions
    } = this.props;
    const { expanded } = this.state;

    if (leg.mode === "CAR" && leg.hailedCar) {
      return (
        <TNCLeg
          config={config}
          followsTransit={followsTransit}
          leg={leg}
          LegIcon={LegIcon}
          onSummaryClick={this.onSummaryClick}
          showLegIcon={showLegIcon}
          timeOptions={timeOptions}
        />
      );
    }

    return (
      <>
        {/* Place subheading: rented vehicle (e.g., scooter, bike, car)
          pickup */}
        {leg && (leg.rentedVehicle || leg.rentedBike || leg.rentedCar) && (
          <RentedVehicleSubheader config={config} leg={leg} />
        )}
        <Styled.LegBody>
          <AccessLegSummary
            config={config}
            leg={leg}
            LegIcon={LegIcon}
            onSummaryClick={this.onSummaryClick}
            showLegIcon={showLegIcon}
          />
          <Styled.StepsHeader onClick={this.onStepsHeaderClick}>
            {coreUtils.time.formatDuration(leg.duration)}
            {leg.steps && (
              <span>
                {" "}
                <Styled.CaretToggle expanded={expanded} />
              </span>
            )}
          </Styled.StepsHeader>

          <LegDiagramPreview
            diagramVisible={diagramVisible}
            leg={leg}
            setLegDiagram={setLegDiagram}
            showElevationProfile={showElevationProfile}
          />
          <VelocityTransitionGroup
            enter={{ animation: "slideDown" }}
            leave={{ animation: "slideUp" }}
          >
            {expanded && <AccessLegSteps steps={leg.steps} />}
          </VelocityTransitionGroup>
        </Styled.LegBody>
      </>
    );
  }
}

AccessLegBody.propTypes = {
  config: coreUtils.types.configType.isRequired,
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible: coreUtils.types.legType,
  followsTransit: PropTypes.bool,
  leg: coreUtils.types.legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  legIndex: PropTypes.number.isRequired,
  setActiveLeg: PropTypes.func.isRequired,
  setLegDiagram: PropTypes.func.isRequired,
  showElevationProfile: PropTypes.bool.isRequired,
  showLegIcon: PropTypes.bool.isRequired,
  timeOptions: coreUtils.types.timeOptionsType
};

AccessLegBody.defaultProps = {
  diagramVisible: null,
  followsTransit: false,
  timeOptions: null
};

export default AccessLegBody;

export {
  AccessLegSteps,
  AccessLegSummary,
  LegDiagramPreview,
  RentedVehicleSubheader,
  Styled,
  TNCLeg
};
