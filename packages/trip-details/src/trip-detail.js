import PropTypes from "prop-types";
import React, { Component } from "react";
import { QuestionCircle, TimesCircle } from "styled-icons/fa-solid";
import { VelocityTransitionGroup } from "velocity-react";

import * as Styled from "./styled";

export default class TripDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggle = () => {
    const { expanded } = this.state;
    if (expanded) this.onHideClick();
    else this.onExpandClick();
  };

  onExpandClick = () => {
    this.setState({ expanded: true });
  };

  onHideClick = () => {
    this.setState({ expanded: false });
  };

  render() {
    const { icon, summary, description } = this.props;
    const { expanded } = this.state;
    return (
      <Styled.TripDetail>
        <Styled.TripDetailIcon>{icon}</Styled.TripDetailIcon>
        <Styled.TripDetailSummary>
          {summary}
          {description && (
            <Styled.ExpandButton onClick={this.toggle}>
              <QuestionCircle size="0.92em" />
            </Styled.ExpandButton>
          )}
          <VelocityTransitionGroup
            enter={{ animation: "slideDown" }}
            leave={{ animation: "slideUp" }}
          >
            {expanded && (
              <Styled.TripDetailDescription>
                <Styled.HideButton onClick={this.onHideClick}>
                  <TimesCircle size="0.92em" />
                </Styled.HideButton>
                {description}
              </Styled.TripDetailDescription>
            )}
          </VelocityTransitionGroup>
        </Styled.TripDetailSummary>
      </Styled.TripDetail>
    );
  }
}

TripDetail.propTypes = {
  icon: PropTypes.node.isRequired,
  summary: PropTypes.node.isRequired,
  description: PropTypes.node
};

TripDetail.defaultProps = {
  description: undefined
};
