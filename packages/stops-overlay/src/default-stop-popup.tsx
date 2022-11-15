import { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Location, Stop } from "@opentripplanner/types";
import flatten from "flat";
import { FormattedMessage } from "react-intl";
import React, { Component } from "react";

import * as S from "./styled";

// Load the default messages.
// @ts-expect-error TODO: why is this failing?
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages = flatten(defaultEnglishMessages);

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  setLocation: ({ location: Location, locationType: string }) => void;
  setViewedStop: ({ stopId: string }) => void;
  stop: Stop & { stops?: string };
};

const renderStop = (stop: Stop | string, onClickView: () => void) => {
  let stopId = stop;
  if (typeof stop !== "string") {
    const { code, id } = stop;
    stopId = code || id.split(":")[1] || id;
  }

  return (
    <BaseMapStyled.PopupRow>
      <span>
        <strong>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.StopsOverlay.stopId"]}
            description="Displays the stop id"
            id="otpUi.StopsOverlay.stopId"
            values={{
              stopId
            }}
          />
        </strong>
      </span>
      <S.ViewStopButton onClick={onClickView}>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.StopsOverlay.stopViewer"]}
          description="Text for link that opens the stop viewer"
          id="otpUi.StopsOverlay.stopViewer"
        />
      </S.ViewStopButton>
    </BaseMapStyled.PopupRow>
  );
};

export default class StopPopup extends Component<Props> {
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
    const { stop, setLocation, setViewedStop } = this.props;
    const { name, stops: stopsString } = stop;

    let stops = [];
    try {
      stops = stopsString && JSON.parse(stopsString);
    } catch {
      console.warn(`Invalid data received! ${stopsString} is not valid json.`);
    }

    return (
      <BaseMapStyled.MapOverlayPopup>
        <BaseMapStyled.PopupTitle>{name}</BaseMapStyled.PopupTitle>
        {setViewedStop &&
          (stops && stops.length > 1
            ? stops.map((s: Stop) => renderStop(s, this.onClickView))
            : renderStop(stop, this.onClickView))}

        {/* The "Set as [from/to]" ButtonGroup */}
        {setLocation && (
          <BaseMapStyled.PopupRow>
            <FromToLocationPicker
              label
              onFromClick={this.onFromClick}
              onToClick={this.onToClick}
            />
          </BaseMapStyled.PopupRow>
        )}
      </BaseMapStyled.MapOverlayPopup>
    );
  }
}
