import React, { ReactElement, useState } from "react";
import { QuestionCircle } from "@styled-icons/fa-solid/QuestionCircle";
import { TimesCircle } from "@styled-icons/fa-solid/TimesCircle";

import AnimateHeight from "react-animate-height";
import { useIntl } from "react-intl";
import * as S from "./styled";

type Props = {
  description?: ReactElement | string;
  icon: ReactElement;
  summary: ReactElement | string;
};

// TODO: Remove these two helper methods by moving to semantically correct HTML
/**
 * Copied from https://stackoverflow.com/questions/50940640/how-to-determine-if-jest-is-running-the-code-or-not
 */
function isRunningJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}

function uuidv4(): string {
  if (isRunningJest()) return "mocked-random-id";

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const TripDetail = ({ icon, summary, description }: Props): JSX.Element => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);

  const id = uuidv4();

  const toggle = (): void => {
    setExpanded(!expanded);
  };

  return (
    <S.TripDetail role="group">
      <S.TripDetailIcon role="presentation">{icon}</S.TripDetailIcon>
      {/* TODO: Adjust the summary and description to be a `summary`/`details` pair, therefore semantically correct */}
      {/* https://github.com/opentripplanner/otp-ui/pull/530#discussion_r1074006057 */}
      <S.TripDetailSummary>
        {summary}
        {description && (
          <S.ExpandButton
            aria-label={
              expanded
                ? intl.formatMessage({
                    id: "otpUi.TripDetails.hideDetail"
                  })
                : intl.formatMessage({
                    id: "otpUi.TripDetails.showDetail"
                  })
            }
            aria-controls={id}
            aria-expanded={expanded}
            id="expand-button"
            onClick={toggle}
            tabIndex={0}
          >
            <QuestionCircle size="0.92em" />
          </S.ExpandButton>
        )}
      </S.TripDetailSummary>
      <AnimateHeight duration={300} height={expanded ? "auto" : 0}>
        <S.TripDetailDescription aria-labelledby="expand-button" id={id}>
          {/** This button isn't needed for screen readers as the main expand-button is
           * more convenient.
           */}
          <S.HideButton role="presentation" onClick={() => setExpanded(false)}>
            <TimesCircle size="0.92em" />
          </S.HideButton>
          {description}
        </S.TripDetailDescription>
      </AnimateHeight>
    </S.TripDetail>
  );
};

export default TripDetail;
