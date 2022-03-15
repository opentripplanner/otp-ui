import React, { Component, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
  onStopClick: ({ stopId: string }) => void;
  stopId: string;
  text?: string;
}

export default class ViewStopButton extends Component<Props> {
  onClick = (): void => {
    const { onStopClick, stopId } = this.props;
    onStopClick({ stopId });
  };

  render(): ReactElement {
    const { text } = this.props;
    return (
      <S.ViewerButton onClick={this.onClick}>
        {text || (
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.TransitLegBody.stopViewer"]}
            description="Text for link that opens the stop viewer"
            id="otpUi.TransitLegBody.stopViewer"
          />
        )}
      </S.ViewerButton>
    );
  }
}
