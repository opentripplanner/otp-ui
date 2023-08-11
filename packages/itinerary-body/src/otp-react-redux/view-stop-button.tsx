import React, { Component, ReactElement } from "react";
import { Stop } from "@opentripplanner/types";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
  onStopClick: (stop: Stop) => void;
  stop: Stop;
}

export default class ViewStopButton extends Component<Props> {
  onClick = (): void => {
    const { onStopClick, stop } = this.props;
    onStopClick(stop);
  };

  render(): ReactElement {
    return (
      <S.ViewerButton onClick={this.onClick}>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TransitLegBody.stopViewer"]}
          description="Text for link that opens the stop viewer"
          id="otpUi.TransitLegBody.stopViewer"
        />
      </S.ViewerButton>
    );
  }
}
