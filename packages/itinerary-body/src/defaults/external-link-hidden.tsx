import React, { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

const ExternalLinkHidden: FunctionComponent = () => (
  <S.SROnly>
    <FormattedMessage
      defaultMessage={defaultMessages["otpUi.ItineraryBody.externalLink"]}
      description="External link text"
      id="otpUi.ItineraryBody.externalLink"
    />
  </S.SROnly>
);

export default ExternalLinkHidden;
