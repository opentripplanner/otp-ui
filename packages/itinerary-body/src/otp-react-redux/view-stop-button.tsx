import React, { Component, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
  onStopClick: ({ stopId: string }) => void;
  stopId: string;
}

export default class ViewStopButton extends Component<Props> {
  onClick = (): void => {
    const { onStopClick, stopId } = this.props;
    onStopClick({ stopId });
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
