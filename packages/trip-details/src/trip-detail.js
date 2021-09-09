import PropTypes from "prop-types";
import React, { Component } from "react";
import { QuestionCircle } from "@styled-icons/fa-solid/QuestionCircle";
import { TimesCircle } from "@styled-icons/fa-solid/TimesCircle";
import { VelocityTransitionGroup } from "velocity-react";

import * as S from "./styled";

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
      <S.TripDetail>
        <S.TripDetailIcon>{icon}</S.TripDetailIcon>
        <S.TripDetailSummary>
          {summary}
          {description && (
            <S.ExpandButton onClick={this.toggle}>
              <QuestionCircle size="0.92em" />
            </S.ExpandButton>
          )}
          <VelocityTransitionGroup
            enter={{ animation: "slideDown" }}
            leave={{ animation: "slideUp" }}
          >
            {expanded && (
              <S.TripDetailDescription>
                <S.HideButton onClick={this.onHideClick}>
                  <TimesCircle size="0.92em" />
                </S.HideButton>
                {description}
              </S.TripDetailDescription>
            )}
          </VelocityTransitionGroup>
        </S.TripDetailSummary>
      </S.TripDetail>
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
