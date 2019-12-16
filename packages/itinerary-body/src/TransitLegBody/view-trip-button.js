import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Styled from "./styled";

class ViewTripButton extends Component {
  onClick = () => {
    const { fromIndex, setViewedTrip, toIndex, tripId } = this.props;
    setViewedTrip({ tripId, fromIndex, toIndex });
  };

  render() {
    return (
      <Styled.ViewTripButton onClick={this.onClick} type="button">
        Trip Viewer
      </Styled.ViewTripButton>
    );
  }
}

ViewTripButton.propTypes = {
  fromIndex: PropTypes.number.isRequired,
  setViewedTrip: PropTypes.func.isRequired,
  tripId: PropTypes.string.isRequired,
  toIndex: PropTypes.number.isRequired
};

export default ViewTripButton;
