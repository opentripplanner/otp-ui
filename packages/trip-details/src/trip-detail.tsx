import React, { Component, ReactElement } from "react";
import { QuestionCircle, TimesCircle } from "styled-icons/fa-solid";
import { VelocityTransitionGroup } from "velocity-react";

import * as Styled from "./styled";

type Props = {
  description?: ReactElement;
  icon: ReactElement;
  summary: ReactElement;
};

type State = {
  expanded: boolean;
};

export default class TripDetail extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggle = (): void => {
    const { expanded } = this.state;
    if (expanded) this.onHideClick();
    else this.onExpandClick();
  };

  onExpandClick = (): void => {
    this.setState({ expanded: true });
  };

  onHideClick = (): void => {
    this.setState({ expanded: false });
  };

  render(): ReactElement {
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
