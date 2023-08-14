import { Config, Leg, LegIconComponent } from "@opentripplanner/types";
import React, { Component, ReactElement } from "react";
import AnimateHeight from "react-animate-height";
import { FormattedMessage } from "react-intl";
import { Duration } from "../defaults";

import * as S from "../styled";
import { SetActiveLegFunction } from "../types";

import AccessLegSteps from "./access-leg-steps";
import AccessLegSummary from "./access-leg-summary";
import LegDiagramPreview from "./leg-diagram-preview";
import MapillaryButton from "./mapillary-button";
import RentedVehicleSubheader from "./rented-vehicle-subheader";
import TNCLeg from "./tnc-leg";

import { defaultMessages } from "../util";

interface Props {
  config: Config;
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible?: Leg;
  followsTransit?: boolean;
  leg: Leg;
  LegIcon: LegIconComponent;
  legIndex: number;
  mapillaryCallback?: (id: string) => void;
  mapillaryKey?: string;
  setActiveLeg: SetActiveLegFunction;
  setLegDiagram: (leg: Leg) => void;
  showElevationProfile: boolean;
  showLegIcon: boolean;
}

interface State {
  expanded: boolean;
}

/**
 * Component for access (e.g. walk/bike/etc.) leg in narrative itinerary. This
 * particular component is used in the line-itin (i.e., trimet-mod-otp) version
 * of the narrative itinerary.
 */
class AccessLegBody extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { expanded: false };
  }

  onStepsHeaderClick = (): void => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  onSummaryClick = (): void => {
    const { leg, legIndex, setActiveLeg } = this.props;
    setActiveLeg(legIndex, leg);
  };

  render(): ReactElement {
    const {
      config,
      diagramVisible,
      followsTransit,
      leg,
      LegIcon,
      mapillaryCallback,
      mapillaryKey,
      setLegDiagram,
      showElevationProfile,
      showLegIcon
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
        <S.LegBody>
          <AccessLegSummary
            config={config}
            leg={leg}
            LegIcon={LegIcon}
            onSummaryClick={this.onSummaryClick}
            showLegIcon={showLegIcon}
          />
          <S.LegDetails>
            <S.StepsHeaderAndMapLink>
              <S.StepsHeader
                aria-expanded={expanded}
                onClick={this.onStepsHeaderClick}
              >
                <Duration seconds={leg.duration} />
                {leg.steps && <S.CaretToggle expanded={expanded} />}
                <S.InvisibleAdditionalDetails>
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages["otpUi.TransitLegBody.expandDetails"]
                    }
                    description="Screen reader text added to expand steps"
                    id="otpUi.TransitLegBody.expandDetails"
                  />
                </S.InvisibleAdditionalDetails>
              </S.StepsHeader>
              <MapillaryButton
                clickCallback={mapillaryCallback}
                coords={leg.from}
                mapillaryKey={mapillaryKey}
              />
            </S.StepsHeaderAndMapLink>
            <AnimateHeight
              duration={500}
              height={expanded ? "auto" : 0}
              style={{ gridColumn: "1 / span 2" }}
            >
              <AccessLegSteps
                mapillaryCallback={mapillaryCallback}
                mapillaryKey={mapillaryKey}
                steps={leg.steps}
              />
            </AnimateHeight>
            <LegDiagramPreview
              diagramVisible={diagramVisible}
              leg={leg}
              setLegDiagram={setLegDiagram}
              showElevationProfile={showElevationProfile}
            />
          </S.LegDetails>
        </S.LegBody>
      </>
    );
  }
}

export default AccessLegBody;

export {
  AccessLegSteps,
  AccessLegSummary,
  LegDiagramPreview,
  RentedVehicleSubheader,
  S as Styled,
  TNCLeg
};
