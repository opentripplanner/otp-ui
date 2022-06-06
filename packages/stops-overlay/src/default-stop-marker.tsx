import {
  MarkerWithPopup,
  Styled as BaseMapStyled
} from "@opentripplanner/base-map";
import flatten from "flat";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Location, Stop } from "@opentripplanner/types";

import { LeafletStyleMarker } from "@opentripplanner/base-map/lib/styled";
import * as S from "./styled";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages = flatten(defaultEnglishMessages);

type Props = {
  // TODO re-add LeafletPath ?
  radius?: number;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  setLocation: ({ location: Location, locationType: string }) => void;
  setViewedStop: ({ stopId: string }) => void;
  stop: Stop;
};

export default class StopMarker extends Component<Props> {
  onClickView = (): void => {
    const { setViewedStop, stop } = this.props;
    setViewedStop({ stopId: stop.id });
  };

  onFromClick = (): void => {
    this.setLocation("from");
  };

  onToClick = (): void => {
    this.setLocation("to");
  };

  setLocation(locationType: string): void {
    const { setLocation, stop } = this.props;
    const { lat, lon, name } = stop;
    setLocation({ location: { lat, lon, name }, locationType });
  }

  render(): JSX.Element {
    const { radius, stop } = this.props;
    const { code, id, lat, lon, name } = stop;
    const userFacingId = code || id.split(":")[1] || id;

    const popup = (
      <BaseMapStyled.MapOverlayPopup>
        <BaseMapStyled.PopupTitle>{name}</BaseMapStyled.PopupTitle>
        <BaseMapStyled.PopupRow>
          <span>
            <strong>
              <FormattedMessage
                defaultMessage={defaultMessages["otpUi.StopsOverlay.stopId"]}
                description="Displays the stop id"
                id="otpUi.StopsOverlay.stopId"
                values={{
                  stopId: userFacingId
                }}
              />
            </strong>
          </span>
          <S.ViewStopButton onClick={this.onClickView}>
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.StopsOverlay.stopViewer"]}
              description="Text for link that opens the stop viewer"
              id="otpUi.StopsOverlay.stopViewer"
            />
          </S.ViewStopButton>
        </BaseMapStyled.PopupRow>

        {/* The "Set as [from/to]" ButtonGroup */}
        <BaseMapStyled.PopupRow>
          <FromToLocationPicker
            label
            onFromClick={this.onFromClick}
            onToClick={this.onToClick}
          />
        </BaseMapStyled.PopupRow>
      </BaseMapStyled.MapOverlayPopup>
    );
    return (
      <MarkerWithPopup position={[lat, lon]} popupContents={popup}>
        <LeafletStyleMarker
          strokeColor="#333333"
          color={stop.color || "#fff"}
          size={radius}
        />
      </MarkerWithPopup>
    );
  }
}
