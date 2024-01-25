import React, { Component, ReactElement } from "react";
import { Stop, StopEventHandler } from "@opentripplanner/types";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
  onStopClick: StopEventHandler;
  stopId?: string;
  stop?: Stop;
}

export default class ViewStopButton extends Component<Props> {
  onClick = (): void => {
    const { onStopClick, stop, stopId } = this.props;
    onStopClick({ ...stop, stopId: "gtfsId" in stop ? stop.gtfsId : stopId });
  };

  render(): ReactElement {
    return (
      <S.ViewerButton onClick={this.onClick} role="link">
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TransitLegBody.stopViewer"]}
          description="Text for link that opens the stop viewer"
          id="otpUi.TransitLegBody.stopViewer"
        />
      </S.ViewerButton>
    );
  }
}
