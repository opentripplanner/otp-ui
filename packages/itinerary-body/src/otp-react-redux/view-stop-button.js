import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { TransparentButton } from "../styled";

const Button = styled(TransparentButton)`
  border-left: 1px solid #000;
  color: #008;
  cursor: pointer;
  height: 14px;
  line-height: 1;
  margin-left: 5px;
  outline: none;
  padding-top: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export default class ViewStopButton extends Component {
  onClick = () => {
    const { onStopClick, stopId } = this.props;
    onStopClick({ stopId });
  };

  render() {
    const { text } = this.props;
    return <Button onClick={this.onClick}>{text}</Button>;
  }
}

ViewStopButton.propTypes = {
  onStopClick: PropTypes.func.isRequired,
  stopId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};
