import React, { Component, ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface TripSection {
  fromIndex: number;
  toIndex: number;
  tripId: string;
}

export type SetViewedTripFunction = (tripSection: TripSection) => void;

type Props = TripSection & {
  setViewedTrip: SetViewedTripFunction;
};

class ViewTripButton extends Component<Props> {
  onClick = (): void => {
    const { fromIndex, setViewedTrip, toIndex, tripId } = this.props;
    setViewedTrip({ fromIndex, toIndex, tripId });
  };

  render(): ReactElement {
    return (
      <S.ViewerButton onClick={this.onClick} type="button">
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
