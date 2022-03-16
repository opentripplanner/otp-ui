// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import { Leg } from "@opentripplanner/types";
import React, { Component, ReactElement } from "react";
import { FormattedMessage, injectIntl, IntlShape } from "react-intl";
import ReactResizeDetector from "react-resize-detector";

import * as S from "../styled";

import { defaultMessages } from "../util";

interface Props {
  diagramVisible?: Leg;
  intl: IntlShape;
  leg: Leg;
  setLegDiagram: (leg: Leg) => void;
  showElevationProfile: boolean;
}

interface State {
  width: number;
}

const METERS_TO_FEET = 3.28084;

function generateSvg(profile, width) {
  const height = 30;
  const { points: ptArr, traversed } = profile;
  let { minElev, maxElev } = profile;
  // Pad the min-max range by 25m on either side
  minElev -= 25;
  maxElev += 25;

  // Transform the point array and store it as an SVG-ready string
  const pts = ptArr
    .map(pt => {
      const x = (pt[0] / traversed) * width;
      const y = height - (height * (pt[1] - minElev)) / (maxElev - minElev);
      return `${x},${y}`;
    })
    .join(" ");

  // Render the SVG
  return (
    <svg height={height} width={width}>
      <polyline points={pts} fill="none" stroke="black" strokeWidth={1.3} />
    </svg>
  );
}

class LegDiagramPreview extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { width: null };
  }

  onResize = (width: number): void => {
    if (width > 0) {
      this.setState({ width });
    }
  };

  /**
   * Determine if the diagram currently visible is for this leg (based on start
   * time).
   */
  isActive = (): boolean => {
    const { diagramVisible, leg } = this.props;
    return diagramVisible && diagramVisible.startTime === leg.startTime;
  };

  onExpandClick = (): void => {
    const { leg, setLegDiagram } = this.props;
    if (this.isActive()) setLegDiagram(null);
    else setLegDiagram(leg);
  };

  /** Round elevation to whole number and add foot (') symbol. */
  formatElevation = (elev: number): string => `${Math.round(elev)}'`;

  render(): ReactElement {
    const { intl, leg, showElevationProfile } = this.props;
    const { width } = this.state;
    if (!showElevationProfile) return null;
    const profile = coreUtils.itinerary.getElevationProfile(leg.steps);
    // Don't show for very short legs
    if (leg.distance < 500 || leg.mode === "CAR") return null;

    return (
      <S.PreviewContainer active={this.isActive()}>
        {/* The preview elevation SVG */}
        <S.PreviewDiagram
          onClick={this.onExpandClick}
          role="button"
          tabIndex={0}
          // This is shown in a tooltip, so use intl.formatMessage.
          title={intl.formatMessage({
            defaultMessage:
              defaultMessages[
                "otpUi.AccessLegBody.LegDiagramPreview.toggleElevationChart"
              ],
            description:
              "Tooltip text describing the toggling of the elevation chart.",
            id: "otpUi.AccessLegBody.LegDiagramPreview.toggleElevationChart"
          })}
        >
          <S.PreviewDiagramTitle>
            <FormattedMessage
              defaultMessage={
                defaultMessages[
                  "otpUi.AccessLegBody.LegDiagramPreview.elevationChart"
                ]
              }
              description="Title text for elevation chart"
              id="otpUi.AccessLegBody.LegDiagramPreview.elevationChart"
            />{" "}
            <S.PreviewDiagramElevationGain>
              ↑{this.formatElevation(profile.gain * METERS_TO_FEET)}
              {"  "}
            </S.PreviewDiagramElevationGain>
            <S.PreviewDiagramElevationLoss>
              ↓{this.formatElevation(-profile.loss * METERS_TO_FEET)}
            </S.PreviewDiagramElevationLoss>
          </S.PreviewDiagramTitle>
          {profile.points.length > 0 ? (
            generateSvg(profile, width)
          ) : (
            <FormattedMessage
              defaultMessage={
                defaultMessages[
                  "otpUi.AccessLegBody.LegDiagramPreview.noElevationData"
                ]
              }
              description="Text shown if no elevation data is available."
              id="otpUi.AccessLegBody.LegDiagramPreview.noElevationData"
            />
          )}
          <ReactResizeDetector handleWidth onResize={this.onResize} />
        </S.PreviewDiagram>
      </S.PreviewContainer>
    );
  }
}

export default injectIntl(LegDiagramPreview);
