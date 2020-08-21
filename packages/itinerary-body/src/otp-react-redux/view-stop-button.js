import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Styled from "../styled";

export default class ViewStopButton extends Component {
  onClick = () => {
    const { onStopClick, stopId } = this.props;
    onStopClick({ stopId });
  };

  render() {
    const { text } = this.props;
    return (
      <Styled.ViewerButton onClick={this.onClick}>{text}</Styled.ViewerButton>
    );
  }
}

ViewStopButton.propTypes = {
  onStopClick: PropTypes.func.isRequired,
  stopId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};
