import React, { Component, ReactElement } from "react";
import { QuestionCircle } from "@styled-icons/fa-solid/QuestionCircle";
import { TimesCircle } from "@styled-icons/fa-solid/TimesCircle";

import AnimateHeight from "react-animate-height";
import * as S from "./styled";

type Props = {
  description?: ReactElement | string;
  icon: ReactElement;
  summary: ReactElement | string;
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
      <S.TripDetail role="group">
        <S.TripDetailIcon role="presentation">{icon}</S.TripDetailIcon>
        <S.TripDetailSummary>
          {summary}
          {description && (
            <S.ExpandButton id="expand-button" onClick={this.toggle}>
              <QuestionCircle size="0.92em" />
            </S.ExpandButton>
          )}
        </S.TripDetailSummary>
        <AnimateHeight duration={300} height={expanded ? "auto" : 0}>
          <S.TripDetailDescription
            aria-expanded={expanded}
            aria-labelledby="expand-button"
          >
            {/** This button isn't needed for screen readers as the main expand-button is
             * more convenient.
             */}
            <S.HideButton role="presentation" onClick={this.onHideClick}>
              <TimesCircle size="0.92em" />
            </S.HideButton>
            {description}
          </S.TripDetailDescription>
        </AnimateHeight>
      </S.TripDetail>
    );
  }
}
