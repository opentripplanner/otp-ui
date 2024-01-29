import React, { Component, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { SetViewedTripFunction, TripSection } from "../types";
import { defaultMessages } from "../util";

type Props = TripSection & {
  setViewedTrip: SetViewedTripFunction;
};

class ViewTripButton extends Component<Props> {
  onClick = (): void => {
    const {
      fromIndex,
      fromStopId,
      setViewedTrip,
      toIndex,
      toStopId,
      tripId
    } = this.props;
    if (fromIndex || toIndex) {
      setViewedTrip({ fromIndex, toIndex, tripId });
    } else {
      setViewedTrip({ fromStopId, toStopId, tripId });
    }
  };

  render(): ReactElement {
    return (
      <S.ViewerButton onClick={this.onClick} role="link">
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TransitLegBody.tripViewer"]}
          description="Link text to the trip viewer"
          id="otpUi.TransitLegBody.tripViewer"
        />
      </S.ViewerButton>
    );
  }
}

export default ViewTripButton;
